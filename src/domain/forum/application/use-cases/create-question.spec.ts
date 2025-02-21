/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';

import { CreateQuestionUseCase } from './create-question';

let questionRepository: InMemoryQuestionRepository;
let sut: CreateQuestionUseCase;

describe('Create question', function () {
	beforeEach(function () {
		questionRepository = new InMemoryQuestionRepository();
		sut = new CreateQuestionUseCase(questionRepository);
	});

	it('should be able to create a question', async () => {
		const result = await sut.execute({
			authorId: '1',
			title: 'Nova pergunta',
			content: 'Conteúdo da pergunta',
			attachmentId: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(questionRepository.items[0]).toEqual(result.value?.question);
		expect(questionRepository.items[0].attachments).toHaveLength(2);
		expect(questionRepository.items[0].attachments).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		]);
	});
});
