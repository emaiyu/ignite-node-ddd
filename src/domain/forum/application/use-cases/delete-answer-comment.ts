/* eslint-disable no-unused-vars */

import type { Either } from '@/core/either';
import { left, right } from '@/core/either';

import type { AnswerCommentRepository } from '../repositories/answer-comment-repository';

import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface DeleteAnswerCommentPayload {
	authorId: string;
	answerCommentId: string;
}

type DeleteAnswerCommentResult = Either<
	ResourceNotFoundError | NotAllowedError,
	{}
>;

export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentRepository: AnswerCommentRepository) {}
	async execute(
		payload: DeleteAnswerCommentPayload,
	): Promise<DeleteAnswerCommentResult> {
		const answerComment = await this.answerCommentRepository.findById(
			payload.answerCommentId,
		);

		if (!answerComment) return left(new ResourceNotFoundError());

		if (answerComment.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());

		await this.answerCommentRepository.delete(answerComment);

		return right({});
	}
}
