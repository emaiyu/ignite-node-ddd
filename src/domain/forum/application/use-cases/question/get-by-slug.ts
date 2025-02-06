/* eslint-disable no-unused-vars */

import type { Question } from '../../../enterprise/entities/question';
import type { QuestionRepository } from '../../repositories/question-repository';

interface GetQuestionBySlugPayload {
	slug: string;
}

interface GetQuestionBySlugResult {
	question: Question;
}

export class GetQuestionBySlugUseCase {
	constructor(private questionRepository: QuestionRepository) {}
	async execute(
		payload: GetQuestionBySlugPayload,
	): Promise<GetQuestionBySlugResult> {
		const question = await this.questionRepository.findBySlug(payload.slug);
		if (!question) throw new Error('Question not found');
		return { question };
	}
}
