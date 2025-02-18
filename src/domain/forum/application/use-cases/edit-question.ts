/* eslint-disable no-unused-vars */

import type { Question } from '@/domain/forum/enterprise/entities/question';

import type { QuestionRepository } from '../repositories/question-repository';

interface EditQuestionPayload {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
}

interface EditQuestionResult {
	question: Question;
}

export class EditQuestionUseCase {
	constructor(private questionRepository: QuestionRepository) {}
	async execute(payload: EditQuestionPayload): Promise<EditQuestionResult> {
		const question = await this.questionRepository.findById(payload.questionId);
		if (!question) throw new Error('Question not found');
		if (question.authorId.toString() !== payload.authorId)
			throw new Error('Not allowed');

		question.title = payload.title;
		question.content = payload.content;

		await this.questionRepository.save(question);
		return {
			question,
		};
	}
}
