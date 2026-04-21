import type { Request, Response } from "express"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"
import type { GetNotaCreditoRequisicoesUseCase } from "../../use-cases/credito/get-nota-credito-requisicoes-use-case.js"

export class GetNotaCreditoRequisicoesController {
  constructor(private useCase: GetNotaCreditoRequisicoesUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId
      if (!userId) {
        return res.status(401).json(errorResponse("Não autorizado", null))
      }

      const notaCreditoId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id

      const dados = await this.useCase.execute(notaCreditoId, userId)
      return res.status(200).json(successResponse(dados))
    } catch (err: unknown) {
      return res
        .status(404)
        .json(errorResponse("Nota de crédito não encontrada", err))
    }
  }
}
