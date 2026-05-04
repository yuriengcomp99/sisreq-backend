import amqp from "amqplib"
import { getRabbitMqUrlLive } from "../../../config/env.js"

const LOG = "[RabbitMQ]"

function redactRabbitMqUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.password) parsed.password = "***"
    return parsed.toString()
  } catch {
    return "<invalid RABBITMQ_URL>"
  }
}

export function getRabbitMqUrl(): string {
  const url = getRabbitMqUrlLive()
  if (!url?.trim()) {
    console.error(LOG, "Missing RABBITMQ_URL")
    throw new Error("Missing RABBITMQ_URL environment variable")
  }
  return url
}

export async function createRabbitConnection() {
  const url = getRabbitMqUrl()
  console.log(LOG, "connecting", redactRabbitMqUrl(url))

  try {
    const connection = await amqp.connect(url)
    console.log(LOG, "connected")

    connection.on("error", (err) => console.error(LOG, "connection error:", err))
    connection.on("close", () => console.warn(LOG, "connection closed"))

    return connection
  } catch (err) {
    console.error(LOG, "connect failed:", err)
    throw err
  }
}

type RetryOptions = {
  maxAttempts?: number
  delayMs?: number
  label?: string
}

/** Retries for consumer startup (e.g. before Docker healthchecks complete on cold boot). */
export async function createRabbitConnectionWithRetry(options: RetryOptions = {}) {
  const maxAttempts = options.maxAttempts ?? 12
  const delayMs = options.delayMs ?? 1000
  const label = options.label ?? "rabbit"
  let lastErr: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await createRabbitConnection()
    } catch (err) {
      lastErr = err
      if (attempt < maxAttempts) {
        console.warn(LOG, `${label} retry ${attempt}/${maxAttempts} in ${delayMs}ms`)
        await new Promise((r) => setTimeout(r, delayMs))
      }
    }
  }

  console.error(LOG, `${label}: failed after ${maxAttempts} attempts`)
  throw lastErr
}
