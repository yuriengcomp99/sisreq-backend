import { prisma } from "../../../database/prisma.js"
import { NotificationRepository } from "../repository/notification-repository.js"

export type CreateNotificationInput = {
  message: string
}

/** For workers/cron only — not wired to HTTP. Instantiate with `new CreateNotificationUseCase(new NotificationRepository())`. */
export class CreateNotificationUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute(data: CreateNotificationInput) {
    const users = await prisma.user.findMany({
      select: { id: true },
    })

    if (users.length === 0) {
      return { count: 0 }
    }

    return this.repository.createManyForUserIds(
      users.map((u) => u.id),
      data.message
    )
  }
}
