import "dotenv/config"
import { getRabbitMqUrlLive } from "../config/env.js"
import { startNotificationUnreadRabbitConsumer } from "./notification-unread-rabbit-consumer.js"
import { startWebSocketGateway } from "./server.js"

/**
 * Processo dedicado ao gateway WebSocket + consumidor `notifications.unread`.
 * Use com `SEPARATE_WS_SERVICE` na API para que pushes Rabbit cheguem aos sockets.
 */
try {
  startWebSocketGateway()
} catch (err: unknown) {
  console.error("[ws-service] falha ao iniciar gateway:", err)
  process.exit(1)
}

if (getRabbitMqUrlLive()) {
  startNotificationUnreadRabbitConsumer({ disconnectPrismaOnClose: false }).catch((err: unknown) => {
    console.error("[ws-service] falha ao iniciar consumidor notifications.unread:", err)
  })
} else {
  console.log(
    "[ws-service] RABBITMQ_URL/AMQP_URL ausente — unread só funciona via push local no mesmo processo que a API."
  )
}
