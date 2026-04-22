import path from "node:path"
import XLSX from "xlsx"
import { getRabbitMqUrlLive } from "../../config/env.js"
import { publishImportFinished } from "../../infra/queue/rabbitmq/import-finished-publisher.js"
import { AtaRepository } from "../../repositories/ata/ata-repository.js"

export class ImportAtaUseCase {
  constructor(private repository: AtaRepository) {}

  async execute(filePath: string) {
    const workbook = XLSX.readFile(filePath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)

    console.log("🔎 Exemplo linha:", rows[0])

    const chunkSize = 50

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize)

      await Promise.all(
        chunk.map((row: any) => {
          const data = {
            pregao: this.safeString(row["Pregão"]),
            objeto: this.safeString(row["Objeto"]),
            ugg: this.safeString(row["UGG"]),
            nrAta: this.safeString(row["Nr Ata"]),
            nrItem: this.safeString(row["Nr Item"]),
            descricao: this.safeString(row["Descrição detalhada"]),
            fornecedor: this.safeString(row["Fornecedor"]),

            inicioVigAta: this.parseDate(row["Início Vig Ata"]),
            fimVigAta: this.parseDate(row["Fim Vig Ata"]),

            valorUnitario: this.parseMoney(row["Val. Unitário"]),

            uasg: this.safeString(row["UASG"]),
            tipoUasg: this.safeString(row["Tipo UASG"]),

            qtdHomologada: this.parseNumber(row["Qtd Homologada"]),
            qtdAutorizada: this.parseNumber(row["Qtd. Autorizada"]),
            qtdSaldo: this.parseNumber(row["Qtd. Saldo"]),
          }

          return this.repository.upsert(data)
        })
      )

      console.log(
        `Processado: ${Math.min(i + chunkSize, rows.length)} de ${rows.length}`
      )
    }

    if (!getRabbitMqUrlLive()) {
      console.warn(
        "[ImportAta] Defina RABBITMQ_URL ou AMQP_URL no .env para publicar em import.finished (importação no banco já foi concluída)."
      )
      return
    }

    const fileName = path.basename(filePath)
    try {
      await publishImportFinished({
        fileName,
        affectedRows: rows.length,
      })
    } catch (err) {
      console.error(
        "[ImportAta] Importação concluída, mas falha ao publicar na fila:",
        err
      )
    }
  }

  private safeString(value: any): string {
    if (!value || value === "Informação ausente") return ""
    return String(value).trim()
  }

  private parseNumber(value: any): number {
    if (!value) return 0

    if (typeof value === "number") return value

    if (typeof value === "string") {
      const parsed = Number(
        value.replace(/\./g, "").replace(",", ".")
      )
      return isNaN(parsed) ? 0 : parsed
    }

    return 0
  }

  private parseMoney(value: any): number {
    return this.parseNumber(value)
  }

  private parseDate(value: any): Date {
    if (!value || value === "Informação ausente") {
      return new Date()
    }

    if (value instanceof Date) {
      return value
    }

    if (typeof value === "number") {
      const excelEpoch = new Date(1899, 11, 30)
      return new Date(excelEpoch.getTime() + value * 86400000)
    }

    if (typeof value === "string") {
      const parts = value.split("/")
      if (parts.length !== 3) return new Date()

      const [day, month, year] = parts
      return new Date(`${year}-${month}-${day}`)
    }

    return new Date()
  }
}