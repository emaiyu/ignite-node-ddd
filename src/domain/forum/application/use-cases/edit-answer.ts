/* eslint-disable no-unused-vars */

import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

import type { AnswerRepository } from '../repositories/answer-repository';

import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface EditAnswerPayload {
	authorId: string;
	answerId: string;
	content: string;
}

type EditAnswerResult = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		answer: Answer;
	}
>;

export class EditAnswerUseCase {
	constructor(private answerRepository: AnswerRepository) {}
	async execute(payload: EditAnswerPayload): Promise<EditAnswerResult> {
		const answer = await this.answerRepository.findById(payload.answerId);
		if (!answer) return left(new ResourceNotFoundError());
		if (answer.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());

		answer.content = payload.content;

		await this.answerRepository.save(answer);
		return right({ answer });
	}
}
