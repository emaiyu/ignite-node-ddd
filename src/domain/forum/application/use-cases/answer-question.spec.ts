/* eslint-disable no-unused-vars */
import { expect, test } from 'vitest';

import type { Answer } from '../../enterprise/entities/answer';
import type { AnswerRepository } from '../repositories/answer-repository';

import { AnswerQuestionUseCase } from './answer-question';

const fakeAnswerRepository: AnswerRepository = {
	create: async (answer: Answer): Promise<void> => {
		return;
	},
};

test('create an answer', async () => {
	const answerQuestion = new AnswerQuestionUseCase(fakeAnswerRepository);
	const answer = await answerQuestion.execute({
		instructorId: '1',
		questionId: '1',
		content: 'Nova resposta',
	});

	expect(answer.content).toEqual('Nova resposta');
});
