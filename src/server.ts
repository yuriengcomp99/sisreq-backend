import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth-routes.js"
import { ataRoutes }  from "./routes/ata-routes.js"
import ReqRouter from "./routes/requisicao-routes.js"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./docs/swagger.js"

dotenv.config()

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

app.use("/auth", authRoutes)

app.use("/ata", ataRoutes)

app.use("/requisicao", ReqRouter)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.get("/", (req, res) => {
  return res.json({ message: "API running" })
})

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080")
})