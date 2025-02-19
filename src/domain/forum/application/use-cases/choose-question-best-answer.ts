/* eslint-disable no-unused-vars */

import { left, right, type Either } from '@/core/either';

import type { Question } from '../../enterprise/entities/question';
import type { AnswerRepository } from '../repositories/answer-repository';
import type { QuestionRepository } from '../repositories/question-repository';

import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface ChooseQuestionBestAnswerQuestionPayload {
	answerId: string;
	authorId: string;
}

type ChooseQuestionBestAnswerQuestionResult = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class ChooseQuestionBestAnswerQuestionUseCase {
	constructor(
		private questionRepository: QuestionRepository,
		private answerRepository: AnswerRepository,
	) {}
	async execute(
		payload: ChooseQuestionBestAnswerQuestionPayload,
	): Promise<ChooseQuestionBestAnswerQuestionResult> {
		const answer = await this.answerRepository.findById(payload.answerId);
		if (!answer) return left(new ResourceNotFoundError());

		const question = await this.questionRepository.findById(
			answer.questionId.toString(),
		);
		if (!question) return left(new ResourceNotFoundError());

		if (question.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());

		question.bestAnswerId = answer.id;

		await this.questionRepository.save(question);

		return right({ question });
	}
}
