/* eslint-disable no-unused-vars */

import type { QuestionCommentRepository } from '../repositories/question-comment-repository';

interface DeleteQuestionCommentPayload {
	authorId: string;
	questionCommentId: string;
}

interface DeleteQuestionCommentResult {}

export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentRepository: QuestionCommentRepository) {}
	async execute(
		payload: DeleteQuestionCommentPayload,
	): Promise<DeleteQuestionCommentResult> {
		const questionComment = await this.questionCommentRepository.findById(
			payload.questionCommentId,
		);

		if (!questionComment) throw new Error('Question comment not found');

		if (questionComment.authorId.toString() !== payload.authorId)
			throw new Error('Not allowed');

		await this.questionCommentRepository.delete(questionComment);

		return {};
	}
}
