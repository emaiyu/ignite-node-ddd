/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestion } from '@test/factories/make-question';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';

import { DeleteQuestionUseCase } from './delete-question';

let questionRepository: InMemoryQuestionRepository;
let sut: DeleteQuestionUseCase;

describe('Delete Question', function () {
	beforeEach(function () {
		questionRepository = new InMemoryQuestionRepository();
		sut = new DeleteQuestionUseCase(questionRepository);
	});

	it('should be able to delete a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		);

		await questionRepository.create(newQuestion);

		await sut.execute({
			questionId: 'question-1',
			authorId: 'author-1',
		});

		expect(questionRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		);

		await questionRepository.create(newQuestion);

		await expect(function () {
			return sut.execute({
				questionId: 'question-1',
				authorId: 'author-2',
			});
		}).rejects.toBeInstanceOf(Error);
	});
});
