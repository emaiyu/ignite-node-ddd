import { beforeEach, describe, expect, it } from 'vitest';

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { makeQuestion } from '@test/factories/make-question';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';

import { GetQuestionBySlugUseCase } from './get-question-by-slug';

let questionRepository: InMemoryQuestionRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
	beforeEach(() => {
		questionRepository = new InMemoryQuestionRepository();
		sut = new GetQuestionBySlugUseCase(questionRepository);
	});

	it('should be able to get a question by slug', async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create('example-question'),
		});

		await questionRepository.create(newQuestion);

		const result = await sut.execute({
			slug: 'example-question',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.question.id).toBeTruthy();
		expect(result.value?.question.title).toEqual(newQuestion.title);
	});
});
