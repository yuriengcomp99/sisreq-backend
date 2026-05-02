import { getRabbitMqUrlLive } from "../../../config/env.js"
import { publishNotificationUnreadPushes } from "../../../infra/queue/rabbitmq/publish-notification-unread.js"
import { pushUnreadCountToUser } from "../../../ws-gateway/push-unread-count.js"
import { NotificationRepository } from "../repository/notification-repository.js"

export class MarkAllNotificationsReadUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute(userId: string) {
    const { count } = await this.repository.markAllAsReadByUserId(userId)
    if (getRabbitMqUrlLive()) {
      await publishNotificationUnreadPushes({ pushes: [{ userId, count: 0 }] }).catch(
        (err: unknown) => {
          console.error("[MarkAllNotificationsRead] falha ao publicar notifications.unread:", err)
        }
      )
    } else {
      pushUnreadCountToUser(userId, 0)
    }
    return { count }
  }
}
