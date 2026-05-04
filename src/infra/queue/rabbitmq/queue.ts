import type { Channel } from "amqplib"

export const QUEUES = {
  IMPORT_FINISHED: "import.finished",
  NOTIFICATION_UNREAD: "notifications.unread",
} as const

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES]

export async function assertQueue(
  channel: Channel,
  queueName: string,
  options: { durable?: boolean } = {}
) {
  const durable = options.durable ?? true
  return channel.assertQueue(queueName, { durable })
}
