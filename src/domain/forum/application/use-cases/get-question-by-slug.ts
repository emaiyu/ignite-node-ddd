/* eslint-disable no-unused-vars */
import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import type { Question } from '@/domain/forum/enterprise/entities/question';

import type { QuestionRepository } from '../repositories/question-repository';

import { ResourceNotFoundError } from './errors/resource-not-found';

interface GetQuestionBySlugPayload {
	slug: string;
}

type GetQuestionBySlugResult = Either<
	ResourceNotFoundError,
	{
		question: Question;
	}
>;

export class GetQuestionBySlugUseCase {
	constructor(private questionRepository: QuestionRepository) {}

	async execute({
		slug,
	}: GetQuestionBySlugPayload): Promise<GetQuestionBySlugResult> {
		const question = await this.questionRepository.findBySlug(slug);

		if (!question) return left(new ResourceNotFoundError());

		return right({
			question,
		});
	}
}
