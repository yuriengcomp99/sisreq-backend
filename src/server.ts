import { env } from "./config/env.js"
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

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.get("/", (req, res) => {
  return res.json({ message: "API running" })
})

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080")
})