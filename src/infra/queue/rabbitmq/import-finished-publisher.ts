import type { Connection } from "amqplib"
import { createRabbitConnection } from "./connection.js"
import { assertQueue, QUEUES } from "./queue.js"
import { publishJson } from "./publisher.js"

const LOG_PREFIX = "[RabbitMQ]"

export type ImportFinishedPayload = {
  fileName: string
  affectedRows: number
}

/**
 * Publica uma mensagem na fila `import.finished` (uma conexão/canal por chamada).
 */
export async function publishImportFinished(
  payload: ImportFinishedPayload
): Promise<boolean> {
  const queueName = QUEUES.IMPORT_FINISHED
  console.log(LOG_PREFIX, "publish →", queueName, payload)

  let connection: Connection | undefined

  try {
    connection = await createRabbitConnection()
    const channel = await connection.createChannel()

    try {
      await assertQueue(channel, queueName)
      const sent = publishJson(channel, queueName, payload)

      if (!sent) {
        console.warn(
          LOG_PREFIX,
          "sendToQueue returned false (broker backpressure?)"
        )
      } else {
        console.log(LOG_PREFIX, "message sent (OK)", queueName)
      }

      return sent
    } finally {
      await channel.close().catch(() => undefined)
    }
  } finally {
    await connection?.close().catch(() => undefined)
  }
}
