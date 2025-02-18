/* eslint-disable no-unused-vars */

import type { Answer } from '@/domain/forum/enterprise/entities/answer';

import type { AnswerRepository } from '../repositories/answer-repository';

interface FetchQuestionAnswersPayload {
	questionId: string;
	page: number;
}

interface FetchQuestionAnswersResult {
	answers: Answer[];
}

export class FetchQuestionAnswersUseCase {
	constructor(private answerRepository: AnswerRepository) {}
	async execute({
		questionId,
		...payload
	}: FetchQuestionAnswersPayload): Promise<FetchQuestionAnswersResult> {
		const answers = await this.answerRepository.findManyByQuestionId(
			questionId,
			payload,
		);
		return { answers };
	}
}
