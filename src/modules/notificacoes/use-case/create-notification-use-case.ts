import { getRabbitMqUrlLive } from "../../../config/env.js"
import { prisma } from "../../../database/prisma.js"
import { publishNotificationUnreadPushes } from "../../../infra/queue/rabbitmq/publish-notification-unread.js"
import { pushUnreadCountToUser } from "../../../ws-gateway/push-unread-count.js"
import { NotificationRepository } from "../repository/notification-repository.js"

export type CreateNotificationInput = {
  message: string
}

export class CreateNotificationUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute(data: CreateNotificationInput) {
    const users = await prisma.user.findMany({
      select: { id: true },
    })

    if (users.length === 0) {
      return { count: 0 }
    }

    const userIds = users.map((u) => u.id)
    const result = await this.repository.createManyForUserIds(
      userIds,
      data.message
    )

    const pushes: Array<{ userId: string; count: number }> = []
    for (const userId of userIds) {
      const count = await this.repository.countUnreadByUserId(userId)
      pushes.push({ userId, count })
    }

    if (getRabbitMqUrlLive()) {
      await publishNotificationUnreadPushes({ pushes }).catch((err: unknown) => {
        console.error("[CreateNotification] falha ao publicar notifications.unread:", err)
      })
    } else {
      for (const p of pushes) {
        pushUnreadCountToUser(p.userId, p.count)
      }
    }

    return result
  }
}
