import dayjs from 'dayjs';

import { AggregateRoot } from '@/core/entities/aggregate-root';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';

import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen';

import { QuestionAttachmentList } from './question-attachment-list';
import { Slug } from './value-objects/slug';

interface Props {
	authorId: UniqueEntityId;
	bestAnswerId?: UniqueEntityId;
	title: string;
	content: string;
	slug: Slug;
	attachments: QuestionAttachmentList;
	createdAt: Date;
	updatedAt?: Date;
}

export class Question extends AggregateRoot<Props> {
	get authorId(): UniqueEntityId {
		return this.props.authorId;
	}

	get bestAnswerId(): UniqueEntityId | undefined {
		return this.props.bestAnswerId;
	}

	get title(): string {
		return this.props.title;
	}

	get content(): string {
		return this.props.content;
	}

	get slug(): Slug {
		return this.props.slug;
	}

	get attachments(): QuestionAttachmentList {
		return this.props.attachments;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date | undefined {
		return this.props.updatedAt;
	}

	get isNew(): boolean {
		return dayjs().diff(this.createdAt, 'days') <= 3;
	}

	get excerpt(): string {
		return this.content.substring(0, 120).trimEnd().concat('...');
	}

	private touch(): void {
		this.props.updatedAt = new Date();
	}

	set title(title: string) {
		this.props.title = title;
		this.props.slug = Slug.createFromText(title);
		this.touch();
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	set attachments(attachments: QuestionAttachmentList) {
		this.props.attachments = attachments;
		this.touch();
	}

	set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
		if (bestAnswerId === undefined) return;

		if (
			this.props.bestAnswerId === undefined ||
			!this.props.bestAnswerId.equals(bestAnswerId)
		) {
			this.addDomainEvent(
				new QuestionBestAnswerChosenEvent(this, bestAnswerId),
			);
		}

		this.props.bestAnswerId = bestAnswerId;
		this.touch();
	}

	static create(
		props: Optional<Props, 'createdAt' | 'slug' | 'attachments'>,
		id?: UniqueEntityId,
	): Question {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				attachments: props.attachments ?? new QuestionAttachmentList(),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return question;
	}
}

export { Props as QuestionProps };
