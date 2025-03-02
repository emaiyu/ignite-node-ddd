/* eslint-disable no-unused-vars */

import type { PaginationParams } from '@/core/repositories/paginate-params';
import type { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import type { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswerRepository implements AnswerRepository {
	public items: Answer[] = [];

	constructor(private answerAttachmentRepository: AnswerAttachmentRepository) {}

	async findById(id: string): Promise<Answer | null> {
		const answer = this.items.find(
			(item) => item.id.toString() === id?.toString(),
		);
		if (!answer) return null;
		return answer;
	}

	async findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<Answer[]> {
		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((params.page - 1) * 20, params.page * 20);
		return answers;
	}

	async create(answer: Answer): Promise<void> {
		this.items.push(answer);
	}

	async save(answer: Answer): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === answer.id.toString(),
		);

		this.items[itemIndex] = answer;
	}

	async delete(answer: Answer): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === answer.id.toString(),
		);

		this.items.splice(itemIndex, 1);
		this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());
	}
}
