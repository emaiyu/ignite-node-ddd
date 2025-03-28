import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { QuestionProps } from '@/domain/forum/enterprise/entities/question';
import { Question } from '@/domain/forum/enterprise/entities/question';

export function makeQuestion(
	override: Partial<QuestionProps> = {},
	id?: UniqueEntityId,
): Question {
	const question = Question.create(
		{
			authorId: new UniqueEntityId(),
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
	return question;
}
