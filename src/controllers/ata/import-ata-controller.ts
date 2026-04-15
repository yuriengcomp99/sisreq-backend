import { Request, Response } from "express"
import { ImportAtaUseCase } from "../../use-cases/ata/import-ata-usecase.js"
import fs from "fs"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class ImportAtaController {
  constructor(private useCase: ImportAtaUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const file = req.file

      if (!file) {
        return res.status(400).json(errorResponse("Arquivo não enviado"))
      }

      await this.useCase.execute(file.path)

      fs.unlinkSync(file.path)

      return res
        .status(200)
        .json(successResponse(null, "Importação realizada com sucesso"))
    } catch (error) {
      console.error(error)

      return res.status(500).json(errorResponse("Erro ao importar Excel", error))
    }
  }
}