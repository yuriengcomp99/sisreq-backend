import { Request, Response } from "express"
import { GetRequisicaoByIdUseCase } from "../../use-cases/requisicao/get-requisicao-by-id-use-case.js"

export class GetRequisicaoByIdController {
  constructor(private useCase: GetRequisicaoByIdUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params

      const requisicao = await this.useCase.execute(id)

      return res.json(requisicao)

    } catch (error: any) {
      return res.status(404).json({
        error: error.message
      })
    }
  }
}