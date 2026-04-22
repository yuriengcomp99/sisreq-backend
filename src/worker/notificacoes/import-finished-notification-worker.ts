import type { ConsumeMessage } from "amqplib"
import { prisma } from "../../database/prisma.js"
import { createRabbitConnection } from "../../infra/queue/rabbitmq/connection.js"
import type { ImportFinishedPayload } from "../../infra/queue/rabbitmq/import-finished-publisher.js"
import { assertQueue, QUEUES } from "../../infra/queue/rabbitmq/queue.js"
import { NotificationRepository } from "../../modules/notificacoes/repository/notification-repository.js"
import { CreateNotificationUseCase } from "../../modules/notificacoes/use-case/create-notification-use-case.js"

const LOG = "[Worker:Notificacoes]"
const MSG =
  "Os dados de capacidade de compras foram atualizados."

function parsePayload(buf: Buffer): ImportFinishedPayload | null {
  try {
    const raw: unknown = JSON.parse(buf.toString("utf8"))
    if (raw === null || typeof raw !== "object") return null
    const o = raw as Record<string, unknown>
    let rows: number | null = null
    if (typeof o.affectedRows === "number" && Number.isFinite(o.affectedRows)) {
      rows = Math.trunc(o.affectedRows)
    } else if (typeof o.affectedRows === "string" && o.affectedRows.trim()) {
      const n = Number(o.affectedRows)
      if (Number.isFinite(n)) rows = Math.trunc(n)
    }
    if (typeof o.fileName === "string" && rows !== null) {
      return { fileName: o.fileName, affectedRows: rows }
    }
  } catch {
    return null
  }
  return null
}

export async function startImportFinishedNotificationConsumer(options?: {
  disconnectPrismaOnClose?: boolean
}): Promise<{ close: () => Promise<void> }> {
  const disconnectPrismaOnClose = options?.disconnectPrismaOnClose ?? false

  const connection = await createRabbitConnection()
  const channel = await connection.createChannel()

  channel.on("error", (err: unknown) => console.error(LOG, "canal:", err))
  channel.on("close", () => console.warn(LOG, "canal fechado"))

  await assertQueue(channel, QUEUES.IMPORT_FINISHED)
  await channel.prefetch(1)

  const useCase = new CreateNotificationUseCase(new NotificationRepository())

  const onMessage = async (msg: ConsumeMessage) => {
    const payload = parsePayload(msg.content)
    if (!payload) {
      console.error(LOG, "JSON inválido:", msg.content.toString("utf8").slice(0, 300))
      channel.ack(msg)
      return
    }
    await useCase.execute({ message: MSG })
    channel.ack(msg)
  }

  const { consumerTag } = await channel.consume(
    QUEUES.IMPORT_FINISHED,
    (msg) => {
      if (!msg) return
      void onMessage(msg).catch((err: unknown) => {
        console.error(LOG, err)
        channel.nack(msg, false, false)
      })
    },
    { noAck: false }
  )

  let closed = false
  return {
    close: async () => {
      if (closed) return
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

export async function runImportFinishedNotificationWorkerCli(): Promise<void> {
  const { close } = await startImportFinishedNotificationConsumer({
    disconnectPrismaOnClose: true,
  })
  await new Promise<void>((resolve) => {
    const stop = () => void close().then(resolve)
    process.once("SIGINT", stop)
    process.once("SIGTERM", stop)
  })
}
