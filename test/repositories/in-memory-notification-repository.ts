/* eslint-disable no-unused-vars */

import type { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository';
import type { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationRepository implements NotificationRepository {
	public items: Notification[] = [];

	async create(notification: Notification): Promise<void> {
		this.items.push(notification);
	}

	async save(notification: Notification): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === notification.id.toString(),
		);

		this.items[itemIndex] = notification;
	}

	async findById(id: string): Promise<Notification | null> {
		const notification = this.items.find(
			(item) => item.id.toString() === id?.toString(),
		);
		if (!notification) return null;
		return notification;
	}
}
