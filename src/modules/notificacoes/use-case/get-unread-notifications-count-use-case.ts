import { NotificationRepository } from "../repository/notification-repository.js"

export class GetUnreadNotificationsCountUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute(userId: string) {
    const count = await this.repository.countUnreadByUserId(userId)
    return { count }
  }
}
