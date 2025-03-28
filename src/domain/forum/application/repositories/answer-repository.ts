/* eslint-disable no-unused-vars */
import type { PaginationParams } from '@/core/repositories/paginate-params';

import type { Answer } from '../../enterprise/entities/answer';

export interface AnswerRepository {
	findById(id: string): Promise<Answer | null>;
	findManyByQuestionId: (
		questionId: string,
		params: PaginationParams,
	) => Promise<Answer[]>;
	create(answer: Answer): Promise<void>;
	save(answer: Answer): Promise<void>;
	delete(answer: Answer): Promise<void>;
}
