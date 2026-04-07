import { Request, Response } from "express"
import { ImportAtaUseCase } from "../../use-cases/ata/import-ata-usecase.js"
import fs from "fs"

export class ImportAtaController {
  constructor(private useCase: ImportAtaUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const file = req.file

      if (!file) {
        return res.status(400).json({
          error: "Arquivo não enviado",
        })
      }

      await this.useCase.execute(file.path)

      fs.unlinkSync(file.path)

      return res.status(200).json({
        message: "Importação realizada com sucesso",
      })
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        error: "Erro ao importar Excel",
      })
    }
  }
}