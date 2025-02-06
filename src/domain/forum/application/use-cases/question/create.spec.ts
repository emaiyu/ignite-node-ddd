/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';

import { CreateQuestionUseCase } from './create';

let questionRepository: InMemoryQuestionRepository;
let sut: CreateQuestionUseCase;

describe('Create question', function () {
	beforeEach(function () {
		questionRepository = new InMemoryQuestionRepository();
		sut = new CreateQuestionUseCase(questionRepository);
	});

	it('should be able to create a question', async () => {
		const { question } = await sut.execute({
			authorId: '1',
			title: 'Nova pergunta',
			content: 'Conteúdo da pergunta',
		});

		expect(question.content).toEqual('Conteúdo da pergunta');
	});
});
