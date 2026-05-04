import "dotenv/config"
import { publishImportFinished } from "../infra/queue/rabbitmq/import-finished-publisher.js"

async function main() {
  const sent = await publishImportFinished({
    fileName: "manual-queue-test.xlsx",
    affectedRows: 1,
  })
  console.log("[publish-import-queue-test] sendToQueue result:", sent)
}

main().catch((err) => {
  console.error("[publish-import-queue-test] failed:", err)
  process.exit(1)
})
