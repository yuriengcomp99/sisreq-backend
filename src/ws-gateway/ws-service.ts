import "dotenv/config"
import { getRabbitMqUrlLive } from "../config/env.js"
import { startNotificationUnreadRabbitConsumer } from "./notification-unread-rabbit-consumer.js"
import { startWebSocketGateway } from "./server.js"

try {
  startWebSocketGateway()
} catch (err: unknown) {
  console.error("[ws-service] gateway failed:", err)
  process.exit(1)
}

if (getRabbitMqUrlLive()) {
  startNotificationUnreadRabbitConsumer({ disconnectPrismaOnClose: false }).catch((err: unknown) => {
    console.error("[ws-service] notifications.unread consumer failed:", err)
  })
} else {
  console.warn("[ws-service] RABBITMQ_URL unset; unread pushes only work in-process")
}
