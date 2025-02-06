/* eslint-disable no-unused-vars */

import type { Question } from '../../enterprise/entities/question';
import type { AnswerRepository } from '../repositories/answer-repository';
import type { QuestionRepository } from '../repositories/question-repository';

interface ChooseQuestionBestAnswerQuestionPayload {
	answerId: string;
	authorId: string;
}

interface ChooseQuestionBestAnswerQuestionResult {
	question: Question;
}

export class ChooseQuestionBestAnswerQuestionUseCase {
	constructor(
		private questionRepository: QuestionRepository,
		private answerRepository: AnswerRepository,
	) {}
	async execute(
		payload: ChooseQuestionBestAnswerQuestionPayload,
	): Promise<ChooseQuestionBestAnswerQuestionResult> {
		const answer = await this.answerRepository.findById(payload.answerId);
		if (!answer) throw new Error('Answer not found');

		const question = await this.questionRepository.findById(
			answer.questionId.toString(),
		);
		if (!question) throw new Error('Question not found');

		if (question.authorId.toString() !== payload.authorId)
			throw new Error('Not allowed');

		question.bestAnswerId = answer.id;

		await this.questionRepository.save(question);

		return { question };
	}
}
