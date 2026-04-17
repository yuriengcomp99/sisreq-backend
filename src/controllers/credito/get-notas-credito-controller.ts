import type { Request, Response } from "express"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"
import type { GetNotasCreditoUseCase } from "../../use-cases/credito/get-notas-credito.js"

export class GetNotasCreditoController {
  constructor(private useCase: GetNotasCreditoUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId
      if (!userId) {
        return res.status(401).json(errorResponse("Não autorizado", null))
      }

      const notas = await this.useCase.execute(userId)
      return res.status(200).json(successResponse(notas))
    } catch (err: unknown) {
      return res
        .status(500)
        .json(errorResponse("Falha ao buscar notas de crédito", err))
    }
  }
}
