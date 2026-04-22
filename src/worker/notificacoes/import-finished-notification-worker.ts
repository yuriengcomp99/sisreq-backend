import type { ConsumeMessage } from "amqplib"
import { prisma } from "../../database/prisma.js"
import { createRabbitConnection } from "../../infra/queue/rabbitmq/connection.js"
import type { ImportFinishedPayload } from "../../infra/queue/rabbitmq/import-finished-publisher.js"
import { assertQueue, QUEUES } from "../../infra/queue/rabbitmq/queue.js"
import { NotificationRepository } from "../../modules/notificacoes/repository/notification-repository.js"
import { CreateNotificationUseCase } from "../../modules/notificacoes/use-case/create-notification-use-case.js"

const LOG_PREFIX = "[Worker:Notificacoes]"

export type ImportFinishedNotificationConsumerHandle = {
  close: () => Promise<void>
}

export type StartImportFinishedNotificationConsumerOptions = {
  /**
   * Se true, {@link ImportFinishedNotificationConsumerHandle.close} chama `prisma.$disconnect()`.
   * Use apenas no processo dedicado (`npm run worker:notificacoes`). No servidor HTTP, deixe false.
   */
  disconnectPrismaOnClose?: boolean
}

function buildNotificationMessage(payload: ImportFinishedPayload): string {
  return `Importação de ATA concluída: "${payload.fileName}" (${payload.affectedRows} registro(s)).`
}

function normalizeAffectedRows(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value)
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value)
    if (Number.isFinite(n)) {
      return Math.trunc(n)
    }
  }
  return null
}

function parsePayload(content: Buffer): ImportFinishedPayload | null {
  try {
    const parsed: unknown = JSON.parse(content.toString("utf8"))
    if (parsed === null || typeof parsed !== "object") {
      return null
    }
    const o = parsed as Record<string, unknown>
    const fileName = o.fileName
    const affectedRows = normalizeAffectedRows(o.affectedRows)
    if (typeof fileName === "string" && affectedRows !== null) {
      return { fileName, affectedRows }
    }
  } catch {
    // ignore
  }
  return null
}

/**
 * Inicia o consumo de `import.finished` e grava notificações para todos os usuários.
 * Não registra handlers de sinal — use em processo dedicado com {@link runImportFinishedNotificationWorkerCli}
 * ou chame {@link ImportFinishedNotificationConsumerHandle.close} no shutdown da aplicação.
 */
export async function startImportFinishedNotificationConsumer(
  options: StartImportFinishedNotificationConsumerOptions = {}
): Promise<ImportFinishedNotificationConsumerHandle> {
  const { disconnectPrismaOnClose = false } = options

  const connection = await createRabbitConnection()
  const channel = await connection.createChannel()

  channel.on("error", (err: unknown) => {
    console.error(LOG_PREFIX, "erro no canal AMQP:", err)
  })
  channel.on("close", () => {
    console.warn(LOG_PREFIX, "canal AMQP fechado")
  })

  await assertQueue(channel, QUEUES.IMPORT_FINISHED)
  await channel.prefetch(1)

  const repository = new NotificationRepository()
  const createNotification = new CreateNotificationUseCase(repository)

  const processMessage = async (msg: ConsumeMessage): Promise<void> => {
    const payload = parsePayload(msg.content)
    if (!payload) {
      console.error(
        LOG_PREFIX,
        "corpo inválido (esperado JSON com fileName: string e affectedRows: number), ack e descarta. Trecho:",
        msg.content.toString("utf8").slice(0, 500)
      )
      channel.ack(msg)
      return
    }

    const message = buildNotificationMessage(payload)
    const result = await createNotification.execute({ message })
    console.log(LOG_PREFIX, "notificações gravadas:", result, payload)
    channel.ack(msg)
  }

  const { consumerTag } = await channel.consume(
    QUEUES.IMPORT_FINISHED,
    (msg) => {
      if (!msg) {
        return
      }
      void processMessage(msg).catch((err: unknown) => {
        console.error(LOG_PREFIX, "erro ao processar mensagem:", err)
        channel.nack(msg, false, false)
      })
    },
    { noAck: false }
  )

  console.log(
    LOG_PREFIX,
    "consumidor ativo na fila",
    QUEUES.IMPORT_FINISHED,
    "consumerTag=",
    consumerTag
  )

  let closed = false
  return {
    close: async () => {
      if (closed) {
        return
      }
      closed = true
      console.log(LOG_PREFIX, "encerrando consumidor…")
      try {
        await channel.cancel(consumerTag)
      } catch {
        // ignore
      }
      try {
        await channel.close()
      } catch {
        // ignore
      }
      try {
        await connection.close()
      } catch {
        // ignore
      }
      if (disconnectPrismaOnClose) {
        try {
          await prisma.$disconnect()
        } catch {
          // ignore
        }
      }
    },
  }
}

/**
 * Processo dedicado: mantém o consumidor até SIGINT/SIGTERM.
 */
export async function runImportFinishedNotificationWorkerCli(): Promise<void> {
  const handle = await startImportFinishedNotificationConsumer({
    disconnectPrismaOnClose: true,
  })

  await new Promise<void>((resolve) => {
    const shutdown = async (signal: string) => {
      console.log(LOG_PREFIX, "encerrando (" + signal + ")…")
      await handle.close()
      resolve()
    }

    process.once("SIGINT", () => void shutdown("SIGINT"))
    process.once("SIGTERM", () => void shutdown("SIGTERM"))
  })
}
