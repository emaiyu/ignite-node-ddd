/* eslint-disable no-unused-vars */

import type { Either } from '@/core/either';
import { left, right } from '@/core/either';

import type { AnswerRepository } from '../repositories/answer-repository';

import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface DeleteAnswerPayload {
	authorId: string;
	answerId: string;
}

type DeleteAnswerResult = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class DeleteAnswerUseCase {
	constructor(private answerRepository: AnswerRepository) {}
	async execute(payload: DeleteAnswerPayload): Promise<DeleteAnswerResult> {
		const answer = await this.answerRepository.findById(payload.answerId);
		if (!answer) return left(new ResourceNotFoundError());
		if (answer.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());
		await this.answerRepository.delete(answer);
		return right({});
	}
}
