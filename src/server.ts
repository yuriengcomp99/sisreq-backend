import { env, isAllowedOrigin } from "./config/env.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth-routes.js"
import { ataRoutes } from "./routes/ata-routes.js"
import ReqRouter from "./routes/requisicao-routes.js"
import type { Request } from "express"
import * as swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./docs/swagger.js"
import { capacidadeRouter } from "./routes/capacidade-routes.js"
import { NotaCreditoRouter } from "./routes/nota-credito-routes.js"
import { DesignationRouter } from "./routes/designation-routes.js"
import { notificationsRouter } from "./routes/notifications-routes.js"
import { dashboardRouter } from "./routes/dashboard-routes.js"

const app = express()

console.info(
  `[cors] mode=${env.isProd ? "production" : "development"} allowed origins:`,
  env.frontendOrigins.join(" | ")
)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true)
        return
      }
      if (isAllowedOrigin(origin)) {
        callback(null, true)
        return
      }
      if (!env.isProd) {
        console.warn("[cors] reflecting non-listed Origin in development:", origin)
        callback(null, true)
        return
      }
      console.warn("[cors] blocked Origin:", origin)
      callback(null, false)
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

function resolveSwaggerServerUrl(req: Request): string {
  const fromEnv = (process.env.SWAGGER_SERVER_URL ?? "").trim()
  if (fromEnv) {
    return fromEnv
  }
  const forwardedProto = (req.get("x-forwarded-proto") ?? "").split(",")[0]?.trim()
  const proto = forwardedProto || req.protocol
  const forwardedHost = (req.get("x-forwarded-host") ?? "").split(",")[0]?.trim()
  const host = forwardedHost || req.get("host")
  if (host) {
    return `${proto}://${host}`
  }
  return `http://localhost:${process.env.API_PORT ?? 8080}`
}

app.get("/docs/openapi.json", (req, res) => {
  const spec = JSON.parse(JSON.stringify(swaggerSpec)) as { servers: { url: string }[] }
  spec.servers = [{ url: resolveSwaggerServerUrl(req) }]
  res.json(spec)
})

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/docs/openapi.json",
    },
  })
)

app.get("/", (req, res) => {
  return res.json({ message: "API running" })
})

const apiPort = Number(process.env.API_PORT ?? process.env.PORT ?? 8080)

app.listen(apiPort, () => {
  console.log(`Listening on port ${apiPort}`)
})
