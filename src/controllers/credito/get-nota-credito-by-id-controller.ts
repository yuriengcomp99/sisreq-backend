import type { Request, Response } from "express"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"
import type { GetNotaCreditoByIdUseCase } from "../../use-cases/credito/get-nota-credito-by-id.js"

export class GetNotaCreditoByIdController {
  constructor(private useCase: GetNotaCreditoByIdUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId
      if (!userId) {
        return res.status(401).json(errorResponse("Não autorizado", null))
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const nota = await this.useCase.execute(id, userId)
      return res.status(200).json(successResponse(nota))
    } catch (err: unknown) {
      return res
        .status(404)
        .json(errorResponse("Nota de crédito não encontrada", err))
    }
  }
}
