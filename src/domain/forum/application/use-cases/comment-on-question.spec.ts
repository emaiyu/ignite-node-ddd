/* eslint-disable no-unused-vars */
import { beforeEach, describe, expect, it } from 'vitest';

import { makeQuestion } from '@test/factories/make-question';
import { InMemoryQuestionCommentRepository } from '@test/repositories/in-memory-question-comment-repository';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';

import { CommentOnQuestionUseCase } from './comment-on-question';

let questionRepository: InMemoryQuestionRepository;
let questionCommentRepository: InMemoryQuestionCommentRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment On Question', function () {
	beforeEach(function () {
		questionRepository = new InMemoryQuestionRepository();
		questionCommentRepository = new InMemoryQuestionCommentRepository();
		sut = new CommentOnQuestionUseCase(
			questionRepository,
			questionCommentRepository,
		);
	});

	it('should be able to comment on question', async () => {
		const question = makeQuestion();
		await questionRepository.create(question);

		await sut.execute({
			authorId: question.authorId.toString(),
			questionId: question.id.toString(),
			content: 'Teste',
		});

		expect(questionCommentRepository.items[0].content).toEqual('Teste');
	});
});
