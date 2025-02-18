/* eslint-disable no-unused-vars */

import type { QuestionComment } from '../../enterprise/entities/question-comment';
import type { QuestionCommentRepository } from '../repositories/question-comment-repository';

interface FetchQuestionCommentsPayload {
	questionId: string;
	page: number;
}

interface FetchQuestionCommentsResult {
	questionComments: QuestionComment[];
}

export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentRepository: QuestionCommentRepository) {}
	async execute({
		questionId,
		...params
	}: FetchQuestionCommentsPayload): Promise<FetchQuestionCommentsResult> {
		const questionComments =
			await this.questionCommentRepository.findManyByQuestionId(
				questionId,
				params,
			);
		return { questionComments };
	}
}
