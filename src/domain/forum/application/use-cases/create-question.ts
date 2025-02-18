/* eslint-disable no-unused-vars */

import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Question } from '../../enterprise/entities/question';
import type { QuestionRepository } from '../repositories/question-repository';

interface CreateQuestionPayload {
	authorId: string;
	title: string;
	content: string;
}

interface CreateQuestionResult {
	question: Question;
}

export class CreateQuestionUseCase {
	constructor(private questionRepository: QuestionRepository) {}
	async execute(payload: CreateQuestionPayload): Promise<CreateQuestionResult> {
		const question = Question.create({
			authorId: new UniqueEntityId(payload.authorId),
			title: payload.title,
			content: payload.content,
		});

		await this.questionRepository.create(question);

		return {
			question,
		};
	}
}
