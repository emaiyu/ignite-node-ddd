/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswer } from '@test/factories/make-answer';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';

import { DeleteAnswerUseCase } from './delete-answer';

let answerRepository: InMemoryAnswerRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer', function () {
	beforeEach(function () {
		answerRepository = new InMemoryAnswerRepository();
		sut = new DeleteAnswerUseCase(answerRepository);
	});

	it('should be able to delete a answer', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('answer-1'),
		);

		await answerRepository.create(newAnswer);

		await sut.execute({
			answerId: 'answer-1',
			authorId: 'author-1',
		});

		expect(answerRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('answer-1'),
		);

		await answerRepository.create(newAnswer);

		await expect(function () {
			return sut.execute({
				answerId: 'answer-1',
				authorId: 'author-2',
			});
		}).rejects.toBeInstanceOf(Error);
	});
});
