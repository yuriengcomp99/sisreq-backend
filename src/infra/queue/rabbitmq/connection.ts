import amqp from "amqplib"
import { getRabbitMqUrlLive } from "../../../config/env.js"

const LOG_PREFIX = "[RabbitMQ]"

function redactRabbitMqUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.password) {
      parsed.password = "***"
    }
    return parsed.toString()
  } catch {
    return "<unparseable RABBITMQ_URL>"
  }
}

export function getRabbitMqUrl(): string {
  const url = getRabbitMqUrlLive()
  if (!url) {
    console.error(LOG_PREFIX, "Missing RABBITMQ_URL environment variable")
    throw new Error("Missing RABBITMQ_URL environment variable")
  }
  return url
}

export async function createRabbitConnection() {
  const url = getRabbitMqUrl()
  const safeUrl = redactRabbitMqUrl(url)

  console.log(LOG_PREFIX, "connecting →", safeUrl)

  try {
    const connection = await amqp.connect(url)

    console.log(LOG_PREFIX, "connection established (OK)")

    connection.on("error", (err) => {
      console.error(LOG_PREFIX, "connection error:", err)
    })
    connection.on("close", () => {
      console.warn(LOG_PREFIX, "connection closed")
    })

    return connection
  } catch (err) {
    console.error(LOG_PREFIX, "failed to connect:", err)
    throw err
  }
}
