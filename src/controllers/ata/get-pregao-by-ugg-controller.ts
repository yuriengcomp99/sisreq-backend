import { Request, Response } from "express"
import { GetPregaoByUggUseCase } from "../../use-cases/ata/get-pregao-by-ugg-usecase.js"

export class GetPregaoByUggController {
  constructor(private useCase: GetPregaoByUggUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { pregao, ugg } = req.params

      const result = await this.useCase.execute(pregao, ugg)

      return res.status(200).json(result)
    } catch (error) {
      return res.status(404).json({
        message: error instanceof Error ? error.message : "Erro interno",
      })
    }
  }
}