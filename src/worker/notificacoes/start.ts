import "dotenv/config"
import { runImportFinishedNotificationWorkerCli } from "./import-finished-notification-worker.js"

void runImportFinishedNotificationWorkerCli().catch((err: unknown) => {
  console.error("[Worker:Notificacoes] falha ao iniciar:", err)
  process.exit(1)
})
