import type { Channel } from "amqplib"

export function publishJson(
  channel: Channel,
  queueName: string,
  payload: unknown
): boolean {
  const body = Buffer.from(JSON.stringify(payload))
  return channel.sendToQueue(queueName, body, {
    persistent: true,
    contentType: "application/json",
  })
}
