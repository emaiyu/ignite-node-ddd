/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswer } from '@test/factories/make-answer';
import { makeQuestion } from '@test/factories/make-question';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';

import { ChooseQuestionBestAnswerQuestionUseCase } from './choose-question-best-answer';
import { NotAllowedError } from './errors/not-allowed';

let answerRepository: InMemoryAnswerRepository;
let questionRepository: InMemoryQuestionRepository;
let sut: ChooseQuestionBestAnswerQuestionUseCase;

describe('Choose Question Best Answer', function () {
	beforeEach(function () {
		answerRepository = new InMemoryAnswerRepository();
		questionRepository = new InMemoryQuestionRepository();
		sut = new ChooseQuestionBestAnswerQuestionUseCase(
			questionRepository,
			answerRepository,
		);
	});

	it('should be able to choose the question a best answer', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		await questionRepository.create(question);
		await answerRepository.create(answer);

		await sut.execute({
			answerId: answer.id?.toString(),
			authorId: question.authorId.toString(),
		});

		expect(questionRepository.items[0].bestAnswerId).toEqual(answer.id);
	});

	it('should not be able to choose another user question best answer', async () => {
		const question = makeQuestion({
			authorId: new UniqueEntityId('author-1'),
		});
		const answer = makeAnswer({ questionId: question.id });

		await questionRepository.create(question);
		await answerRepository.create(answer);

		// await expect(function () {
		// 	return sut.execute({
		// 		answerId: answer.id?.toString(),
		// 		authorId: 'author-2',
		// 	});
		// }).rejects.toBeInstanceOf(Error);

		const result = await sut.execute({
			answerId: answer.id?.toString(),
			authorId: 'author-2',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
