/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';

import { AnswerQuestionUseCase } from './answer-question';

let answerRepository: InMemoryAnswerRepository;
let sut: AnswerQuestionUseCase;

describe('Answer question', function () {
	beforeEach(function () {
		answerRepository = new InMemoryAnswerRepository();
		sut = new AnswerQuestionUseCase(answerRepository);
	});

	it('should be able to answer a question', async () => {
		const { answer } = await sut.execute({
			instructorId: '1',
			questionId: '1',
			content: 'Nova resposta',
		});

		expect(answer.content).toEqual('Nova resposta');
	});
});
