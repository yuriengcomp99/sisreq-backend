import type { Request, Response } from "express"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"
import type { DeleteNotaCreditoUseCase } from "../../use-cases/credito/delete-nota-credito.js"

export class DeleteNotaCreditoController {
  constructor(private useCase: DeleteNotaCreditoUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId
      if (!userId) {
        return res.status(401).json(errorResponse("Não autorizado", null))
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      await this.useCase.execute(id, userId)
      return res
        .status(200)
        .json(successResponse(null, "Nota de crédito removida com sucesso"))
    } catch (err: unknown) {
      return res
        .status(400)
        .json(errorResponse("Falha ao remover nota de crédito", err))
    }
  }
}
