/**
 * Teste manual da fila `import.finished` (sem passar pelo import de ATA).
 *
 * Uso (na raiz do projeto, com .env e RabbitMQ acessível):
 *   npx tsx src/scripts/publish-import-queue-test.ts
 */
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
