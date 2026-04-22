import { prisma } from "../../../database/prisma.js"

export class NotificationRepository {
  async findByUserId(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        message: true,
        read: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async markAllAsReadByUserId(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  }
}
