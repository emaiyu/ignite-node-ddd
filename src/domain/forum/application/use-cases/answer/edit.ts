/* eslint-disable no-unused-vars */

import type { Answer } from '@/domain/forum/enterprise/entities/answer';

import type { AnswerRepository } from '../../repositories/answer-repository';

interface EditAnswerPayload {
	authorId: string;
	answerId: string;
	content: string;
}

interface EditAnswerResult {
	answer: Answer;
}

export class EditAnswerUseCase {
	constructor(private answerRepository: AnswerRepository) {}
	async execute(payload: EditAnswerPayload): Promise<EditAnswerResult> {
		const answer = await this.answerRepository.findById(payload.answerId);
		if (!answer) throw new Error('Answer not found');
		if (answer.authorId.toString() !== payload.authorId)
			throw new Error('Not allowed');

		answer.content = payload.content;

		await this.answerRepository.save(answer);
		return { answer };
	}
}
