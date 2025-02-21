/* eslint-disable no-unused-vars */

import { right, type Either } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import type { QuestionRepository } from '../repositories/question-repository';

interface CreateQuestionPayload {
	authorId: string;
	title: string;
	content: string;
	attachmentId: string[];
}

type CreateQuestionResult = Either<
	null,
	{
		question: Question;
	}
>;

export class CreateQuestionUseCase {
	constructor(private questionRepository: QuestionRepository) {}
	async execute(payload: CreateQuestionPayload): Promise<CreateQuestionResult> {
		const question = Question.create({
			authorId: new UniqueEntityId(payload.authorId),
			title: payload.title,
			content: payload.content,
		});

		const attachments = payload.attachmentId.map((attachmentId) => {
			return QuestionAttachment.create({
				questionId: question.id,
				attachmentId: new UniqueEntityId(attachmentId),
			});
		});

		question.attachments = attachments;

		await this.questionRepository.create(question);

		return right({
			question,
		});
	}
}
