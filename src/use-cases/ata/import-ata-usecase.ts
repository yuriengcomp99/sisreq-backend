import XLSX from "xlsx"
import { AtaRepository } from "../../repositories/ata/ata-repository.js"

export class ImportAtaUseCase {
  constructor(private repository: AtaRepository) {}

  async execute(filePath: string) {
    const workbook = XLSX.readFile(filePath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)

    const chunkSize = 50

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize)

      await Promise.all(
        chunk.map((row) => {
          const data = {
            pregao: String(row["Pregão"]),
            objeto: String(row["Objeto"]),
            ugg: String(row["UGG"]),
            nrAta: String(row["Nr Ata"]),
            nrItem: String(row["Nr Item"]),
            descricao: String(row["Descrição detalhada"]),
            fornecedor: String(row["Fornecedor"]),
            inicioVigAta: this.parseDate(row["Início Vig Ata"]),
            fimVigAta: this.parseDate(row["Fim Vig Ata"]),
            valorUnitario: this.parseMoney(row["Val. Unitário"]),
            uasg: String(row["UASG"]),
            tipoUasg: String(row["Tipo UASG"]),
            qtdHomologada: Number(row["Qtd Homologada"]),
            qtdAutorizada: Number(row["Qtd. Autorizada"]),
            qtdSaldo: Number(row["Qtd. Saldo"]),
          }

          return this.repository.upsert(data)
        })
      )

      console.log(
        `✅ Processado: ${Math.min(i + chunkSize, rows.length)} de ${rows.length}`
      )
    }
  }

  private parseMoney(value: any): number {
    if (!value || value === "Informação ausente") return 0

    if (typeof value === "number") return value

    if (typeof value === "string") {
      const parsed = Number(
        value.replace(/\./g, "").replace(",", ".")
      )
      return isNaN(parsed) ? 0 : parsed
    }

    return 0
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