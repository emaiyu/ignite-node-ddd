/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { makeQuestion } from '@test/factories/make-question';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';

import { FetchRecentQuestionUseCase } from './fetch-recent-questions';

let questionRepository: InMemoryQuestionRepository;
let sut: FetchRecentQuestionUseCase;

describe('Fetch Recent Question', function () {
	beforeEach(function () {
		questionRepository = new InMemoryQuestionRepository();
		sut = new FetchRecentQuestionUseCase(questionRepository);
	});

	it('should be able to fetch recent question', async () => {
		await questionRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 20),
			}),
		);
		await questionRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 18),
			}),
		);
		await questionRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 23),
			}),
		);

		const result = await sut.execute({
			page: 1,
		});

		expect(result.isRight()).toBe(true);

		expect(result.value?.questions).toHaveLength(3);
		expect(result.value?.questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
		]);
	});

	it('should be able to fetch paginated recent question', async () => {
		for (let i = 1; i <= 22; i++) {
			await questionRepository.create(makeQuestion({}));
		}

		const result = await sut.execute({
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.questions).toHaveLength(2);
	});
});
