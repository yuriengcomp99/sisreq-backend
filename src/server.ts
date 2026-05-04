import { env, getRabbitMqUrlLive } from "./config/env.js"

const separateWsService = (() => {
  const v = (process.env.SEPARATE_WS_SERVICE ?? "").trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes"
})()
import { startImportFinishedNotificationConsumer } from "./worker/notificacoes/import-finished-notification-worker.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth-routes.js"
import { ataRoutes }  from "./routes/ata-routes.js"
import ReqRouter from "./routes/requisicao-routes.js"
import * as swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./docs/swagger.js"
import { capacidadeRouter } from "./routes/capacidade-routes.js"
import { NotaCreditoRouter } from "./routes/nota-credito-routes.js"
import { DesignationRouter } from "./routes/designation-routes.js"
import { notificationsRouter } from "./routes/notifications-routes.js"
import { dashboardRouter } from "./routes/dashboard-routes.js"
import { startNotificationUnreadRabbitConsumer } from "./ws-gateway/notification-unread-rabbit-consumer.js"
import { startWebSocketGateway } from "./ws-gateway/server.js"

const app = express()

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true)
        return
      }
      callback(null, env.frontendOrigins.includes(origin))
    },
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json())

app.use("/auth", authRoutes)

app.use("/pregoes", ataRoutes)

app.use("/requisicoes", ReqRouter)

app.use("/capacidade", capacidadeRouter)

app.use("/nota-credito", NotaCreditoRouter)

app.use("/designation", DesignationRouter)

app.use("/notifications", notificationsRouter)

app.use("/dashboard", dashboardRouter)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.get("/", (req, res) => {
  return res.json({ message: "API running" })
})

const apiPort = Number(process.env.API_PORT ?? process.env.PORT ?? 8080)

app.listen(apiPort, () => {
  console.log(`Listening on port ${apiPort}`)

  if (!separateWsService) {
    try {
      startWebSocketGateway()
    } catch (err: unknown) {
      console.error("[ws-gateway] failed to start:", err)
    }
  } else {
    console.log("[api] SEPARATE_WS_SERVICE: use npm run dev:ws-service or the ws Docker service")
  }

  if (getRabbitMqUrlLive()) {
    startImportFinishedNotificationConsumer({ disconnectPrismaOnClose: false }).catch((err: unknown) => {
      console.error("[import.finished consumer] failed to start:", err)
    })
    if (!separateWsService) {
      startNotificationUnreadRabbitConsumer({ disconnectPrismaOnClose: false }).catch((err: unknown) => {
        console.error("[notifications.unread consumer] failed to start:", err)
      })
    }
  } else {
    console.warn("[api] RABBITMQ_URL unset; import.finished consumer not started")
  }
})