import { NotificationRepository } from "../repositor/notification-repository.js"

export class MarkAllNotificationsReadUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute(userId: string) {
    const { count } = await this.repository.markAllAsReadByUserId(userId)
    return { count }
  }
}
