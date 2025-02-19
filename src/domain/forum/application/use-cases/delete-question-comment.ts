/* eslint-disable no-unused-vars */

import type { Either } from '@/core/either';
import { left, right } from '@/core/either';

import type { QuestionCommentRepository } from '../repositories/question-comment-repository';

import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface DeleteQuestionCommentPayload {
	authorId: string;
	questionCommentId: string;
}

type DeleteQuestionCommentResult = Either<
	ResourceNotFoundError | NotAllowedError,
	{}
>;

export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentRepository: QuestionCommentRepository) {}
	async execute(
		payload: DeleteQuestionCommentPayload,
	): Promise<DeleteQuestionCommentResult> {
		const questionComment = await this.questionCommentRepository.findById(
			payload.questionCommentId,
		);

		if (!questionComment) return left(new ResourceNotFoundError());

		if (questionComment.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());

		await this.questionCommentRepository.delete(questionComment);

		return right({});
	}
}
