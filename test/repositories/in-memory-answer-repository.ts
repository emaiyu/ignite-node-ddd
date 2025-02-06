import type { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswerRepository implements AnswerRepository {
	public items: Answer[] = [];

	async findById(id: string): Promise<Answer | null> {
		const answer = this.items.find(
			(item) => item.id.toString() === id?.toString(),
		);
		if (!answer) return null;
		return answer;
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
	}
}
