/* eslint-disable no-unused-vars */

import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import type { Question } from '@/domain/forum/enterprise/entities/question';

import type { QuestionRepository } from '../repositories/question-repository';

import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface EditQuestionPayload {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
}

type EditQuestionResult = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class EditQuestionUseCase {
	constructor(private questionRepository: QuestionRepository) {}
	async execute(payload: EditQuestionPayload): Promise<EditQuestionResult> {
		const question = await this.questionRepository.findById(payload.questionId);
		if (!question) return left(new ResourceNotFoundError());
		if (question.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());

		question.title = payload.title;
		question.content = payload.content;

		await this.questionRepository.save(question);
		return right({ question });
	}
}
