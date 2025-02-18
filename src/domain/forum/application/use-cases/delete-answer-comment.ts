/* eslint-disable no-unused-vars */

import type { AnswerCommentRepository } from '../repositories/answer-comment-repository';

interface DeleteAnswerCommentPayload {
	authorId: string;
	answerCommentId: string;
}

interface DeleteAnswerCommentResult {}

export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentRepository: AnswerCommentRepository) {}
	async execute(
		payload: DeleteAnswerCommentPayload,
	): Promise<DeleteAnswerCommentResult> {
		const answerComment = await this.answerCommentRepository.findById(
			payload.answerCommentId,
		);

		if (!answerComment) throw new Error('Answer comment not found');

		if (answerComment.authorId.toString() !== payload.authorId)
			throw new Error('Not allowed');

		await this.answerCommentRepository.delete(answerComment);

		return {};
	}
}
