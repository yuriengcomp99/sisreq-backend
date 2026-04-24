import { pushUnreadCountToUser } from "../../../ws-gateway/push-unread-count.js"
import { NotificationRepository } from "../repository/notification-repository.js"

export class MarkAllNotificationsReadUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute(userId: string) {
    const { count } = await this.repository.markAllAsReadByUserId(userId)
    pushUnreadCountToUser(userId, 0)
    return { count }
  }
}
