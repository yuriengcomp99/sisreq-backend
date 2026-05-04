import { createRabbitConnection } from "./connection.js"
import { assertQueue, QUEUES } from "./queue.js"
import { publishJson } from "./publisher.js"

const LOG = "[RabbitMQ]"

export type NotificationUnreadRabbitPayload = {
  pushes: Array<{ userId: string; count: number }>
}

export async function publishNotificationUnreadPushes(
  payload: NotificationUnreadRabbitPayload
): Promise<boolean> {
  const queueName = QUEUES.NOTIFICATION_UNREAD
  let connection: Awaited<ReturnType<typeof createRabbitConnection>> | undefined

  try {
    connection = await createRabbitConnection()
    const channel = await connection.createChannel()

    try {
      await assertQueue(channel, queueName)
      const sent = publishJson(channel, queueName, payload)
      if (!sent) console.warn(LOG, "sendToQueue returned false", queueName)
      return sent
    } finally {
      await channel.close().catch(() => undefined)
    }
  } finally {
    await connection?.close().catch(() => undefined)
  }
}
