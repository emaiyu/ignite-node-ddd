/* eslint-disable no-unused-vars */

import type { QuestionRepository } from '../repositories/question-repository';

interface DeleteQuestionPayload {
	authorId: string;
	questionId: string;
}

interface DeleteQuestionResult {}

export class DeleteQuestionUseCase {
	constructor(private questionRepository: QuestionRepository) {}
	async execute(payload: DeleteQuestionPayload): Promise<DeleteQuestionResult> {
		const question = await this.questionRepository.findById(payload.questionId);
		if (!question) throw new Error('Question not found');
		if (question.authorId.toString() !== payload.authorId)
			throw new Error('Not allowed');
		await this.questionRepository.delete(question);
		return {};
	}
}
