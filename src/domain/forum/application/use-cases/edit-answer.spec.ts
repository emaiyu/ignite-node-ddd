/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswer } from '@test/factories/make-answer';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';

import { EditAnswerUseCase } from './edit-answer';
import { NotAllowedError } from './errors/not-allowed';

let answerRepository: InMemoryAnswerRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer', function () {
	beforeEach(function () {
		answerRepository = new InMemoryAnswerRepository();
		sut = new EditAnswerUseCase(answerRepository);
	});

	it('should be able to edit a answer', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('answer-1'),
		);

		await answerRepository.create(newAnswer);

		await sut.execute({
			answerId: newAnswer.id?.toValue(),
			authorId: 'author-1',
			content: 'Conteúdo da pergunta 1',
		});

		expect(answerRepository.items[0]).toMatchObject({
			content: 'Conteúdo da pergunta 1',
		});
	});

	it('should not be able to edit a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('answer-1'),
		);

		await answerRepository.create(newAnswer);

		// await expect(function () {
		// 	return sut.execute({
		// 		answerId: newAnswer.id?.toValue(),
		// 		authorId: 'author-2',
		// 		content: 'Conteúdo da pergunta 1',
		// 	});
		// }).rejects.toBeInstanceOf(Error);
		const result = await sut.execute({
			answerId: newAnswer.id?.toValue(),
			authorId: 'author-2',
			content: 'Conteúdo da pergunta 1',
		});
		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
