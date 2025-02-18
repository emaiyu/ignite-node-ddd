import type { PaginationParams } from '@/core/repositories/paginate-params';
import type { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export class InMemoryQuestionCommentRepository
	implements QuestionCommentRepository
{
	public items: QuestionComment[] = [];

	async create(questionComment: QuestionComment): Promise<void> {
		this.items.push(questionComment);
	}

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = this.items.find(
			(item) => item.id.toString() === id?.toString(),
		);
		if (!questionComment) return null;
		return questionComment;
	}

	async findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComment[]> {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((params.page - 1) * 20, params.page * 20);
		return questionComments;
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === questionComment.id.toString(),
		);

		this.items.splice(itemIndex, 1);
	}
}
