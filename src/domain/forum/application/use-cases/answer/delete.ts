/* eslint-disable no-unused-vars */

import type { AnswerRepository } from '../../repositories/answer-repository';

interface DeleteAnswerPayload {
	authorId: string;
	answerId: string;
}

interface DeleteAnswerResult {}

export class DeleteAnswerUseCase {
	constructor(private answerRepository: AnswerRepository) {}
	async execute(payload: DeleteAnswerPayload): Promise<DeleteAnswerResult> {
		const answer = await this.answerRepository.findById(payload.answerId);
		if (!answer) throw new Error('Answer not found');
		if (answer.authorId.toString() !== payload.authorId)
			throw new Error('Not allowed');
		await this.answerRepository.delete(answer);
		return {};
	}
}
