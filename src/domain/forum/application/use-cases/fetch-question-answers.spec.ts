/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswer } from '@test/factories/make-answer';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';

import { FetchQuestionAnswersUseCase } from './fetch-question-answers';

let answerRepository: InMemoryAnswerRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch Question Answers', function () {
	beforeEach(function () {
		answerRepository = new InMemoryAnswerRepository();
		sut = new FetchQuestionAnswersUseCase(answerRepository);
	});

	it('should be able to fetch question answers', async () => {
		await answerRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('question-id') }),
		);
		await answerRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('question-id') }),
		);
		await answerRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('question-id') }),
		);

		const result = await sut.execute({
			questionId: 'question-id',
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answers).toHaveLength(3);
	});

	it('should be able to fetch paginated question answers', async () => {
		for (let i = 1; i <= 22; i++) {
			await answerRepository.create(
				makeAnswer({ questionId: new UniqueEntityId('question-id') }),
			);
		}

		const result = await sut.execute({
			questionId: 'question-id',
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answers).toHaveLength(2);
	});
});
