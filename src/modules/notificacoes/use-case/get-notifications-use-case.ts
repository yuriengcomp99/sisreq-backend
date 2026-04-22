import { NotificationRepository } from "../repository/notification-repository.js"

export class GetNotificationsUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute(userId: string) {
    return this.repository.findByUserId(userId)
  }
}
