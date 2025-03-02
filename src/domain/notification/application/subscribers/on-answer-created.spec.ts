import type { MockInstance } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeAnswer } from '@test/factories/make-answer';
import { makeQuestion } from '@test/factories/make-question';
import { InMemoryAnswerAttachmentRepository } from '@test/repositories/in-memory-answer-attachment-repository';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';
import { InMemoryNotificationRepository } from '@test/repositories/in-memory-notification-repository';
import { InMemoryQuestionAttachmentRepository } from '@test/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';
import { waitFor } from '@test/utils/wait-for';

import { SendNotificationUseCase } from '../use-cases/send-notification';

import { OnAnswerCreated } from './on-answer-created';

let questionRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let answerRepository: InMemoryAnswerRepository;
let answerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let notificationsRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: MockInstance;

describe('On answer created', () => {
	beforeEach(() => {
		questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
		questionRepository = new InMemoryQuestionRepository(
			questionAttachmentRepository,
		);
		answerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentRepository);
		notificationsRepository = new InMemoryNotificationRepository();
		sendNotificationUseCase = new SendNotificationUseCase(
			notificationsRepository,
		);

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

		new OnAnswerCreated(questionRepository, sendNotificationUseCase);
	});

	it('should send a notification when an answer is created', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});

		await questionRepository.create(question);
		await answerRepository.create(answer);

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toHaveBeenCalled();
		});
	});
});
