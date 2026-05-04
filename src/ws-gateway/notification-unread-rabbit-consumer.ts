import type { ConsumeMessage } from "amqplib"
import { prisma } from "../database/prisma.js"
import { createRabbitConnectionWithRetry } from "../infra/queue/rabbitmq/connection.js"
import type { NotificationUnreadRabbitPayload } from "../infra/queue/rabbitmq/publish-notification-unread.js"
import { assertQueue, QUEUES } from "../infra/queue/rabbitmq/queue.js"
import { pushUnreadCountToUser } from "./push-unread-count.js"

const LOG = "[notifications.unread]"

function parsePayload(buf: Buffer): NotificationUnreadRabbitPayload | null {
  try {
    const raw: unknown = JSON.parse(buf.toString("utf8"))
    if (raw === null || typeof raw !== "object") {
      return null
    }
    const o = raw as Record<string, unknown>
    if (!Array.isArray(o.pushes)) {
      return null
    }
    const pushes: Array<{ userId: string; count: number }> = []
    for (const item of o.pushes) {
      if (item === null || typeof item !== "object") {
        return null
      }
      const p = item as Record<string, unknown>
      if (typeof p.userId !== "string" || typeof p.count !== "number") {
        return null
      }
      if (!Number.isFinite(p.count) || p.count < 0) {
        return null
      }
      pushes.push({ userId: p.userId, count: Math.trunc(p.count) })
    }
    return { pushes }
  } catch {
    return null
  }
}

export async function startNotificationUnreadRabbitConsumer(options?: {
  disconnectPrismaOnClose?: boolean
}): Promise<{ close: () => Promise<void> }> {
  const disconnectPrismaOnClose = options?.disconnectPrismaOnClose ?? false

  const connection = await createRabbitConnectionWithRetry({
    label: "notifications.unread consumer",
  })
  const channel = await connection.createChannel()

  channel.on("error", (err: unknown) => console.error(LOG, "channel error:", err))
  channel.on("close", () => console.warn(LOG, "channel closed"))

  await assertQueue(channel, QUEUES.NOTIFICATION_UNREAD)
  await channel.prefetch(1)

  const onMessage = async (msg: ConsumeMessage) => {
    const payload = parsePayload(msg.content)
    if (!payload) {
      console.error(LOG, "invalid JSON:", msg.content.toString("utf8").slice(0, 300))
      channel.ack(msg)
      return
    }
    for (const { userId, count } of payload.pushes) {
      pushUnreadCountToUser(userId, count)
    }
    channel.ack(msg)
  }

  const { consumerTag } = await channel.consume(
    QUEUES.NOTIFICATION_UNREAD,
    (msg) => {
      if (!msg) {
        return
      }
      void onMessage(msg).catch((err: unknown) => {
        console.error(LOG, err)
        channel.nack(msg, false, false)
      })
    },
    { noAck: false }
  )

  console.log(LOG, "consumer ready:", QUEUES.NOTIFICATION_UNREAD)

  let closed = false
  return {
    close: async () => {
      if (closed) {
        return
      }
      closed = true
      await channel.cancel(consumerTag).catch(() => undefined)
      await channel.close().catch(() => undefined)
      await connection.close().catch(() => undefined)
      if (disconnectPrismaOnClose) {
        await prisma.$disconnect().catch(() => undefined)
      }
    },
  }
}
