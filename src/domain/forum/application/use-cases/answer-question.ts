/* eslint-disable no-unused-vars */
import { right, type Either } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Answer } from '../../enterprise/entities/answer';
import type { AnswerRepository } from '../repositories/answer-repository';

interface AnswerQuestionPayload {
	instructorId: string;
	questionId: string;
	content: string;
}

type AnswerQuestionResult = Either<
	null,
	{
		answer: Answer;
	}
>;

export class AnswerQuestionUseCase {
	constructor(private answerRepository: AnswerRepository) {}
	async execute(payload: AnswerQuestionPayload): Promise<AnswerQuestionResult> {
		const answer = Answer.create({
			content: payload.content,
			authorId: new UniqueEntityId(payload.instructorId),
			questionId: new UniqueEntityId(payload.questionId),
		});

		await this.answerRepository.create(answer);
		return right({ answer });
	}
}
