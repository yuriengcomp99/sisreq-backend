import { Request, Response } from "express"
import { GetCapacidadeUseCase } from "../../use-cases/capacidade/get-capacidade-usecase.js"

export class GetCapacidadeController {
  constructor(private useCase: GetCapacidadeUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { description } = req.query

      const result = await this.useCase.execute(
        description as string | undefined
      )

      return res.status(200).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        message: "Erro ao buscar capacidade",
      })
    }
  }
}