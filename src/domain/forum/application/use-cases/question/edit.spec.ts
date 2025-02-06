/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestion } from '@test/factories/make-question';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';

import { EditQuestionUseCase } from './edit';

let questionRepository: InMemoryQuestionRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', function () {
	beforeEach(function () {
		questionRepository = new InMemoryQuestionRepository();
		sut = new EditQuestionUseCase(questionRepository);
	});

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		);

		await questionRepository.create(newQuestion);

		await sut.execute({
			questionId: newQuestion.id?.toValue(),
			authorId: 'author-1',
			title: 'Pergunta 1',
			content: 'Conteúdo da pergunta 1',
		});

		expect(questionRepository.items[0]).toMatchObject({
			title: 'Pergunta 1',
			content: 'Conteúdo da pergunta 1',
		});
	});

	it('should not be able to edit a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		);

		await questionRepository.create(newQuestion);

		await expect(function () {
			return sut.execute({
				questionId: newQuestion.id?.toValue(),
				authorId: 'author-2',
				title: 'Pergunta 1',
				content: 'Conteúdo da pergunta 1',
			});
		}).rejects.toBeInstanceOf(Error);
	});
});
