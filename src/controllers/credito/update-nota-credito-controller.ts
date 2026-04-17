import type { Request, Response } from "express"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"
import type { UpdateNotaCreditoUseCase } from "../../use-cases/credito/update-nota-credito.js"

export class UpdateNotaCreditoController {
  constructor(private useCase: UpdateNotaCreditoUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId
      if (!userId) {
        return res.status(401).json(errorResponse("Não autorizado", null))
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const nota = await this.useCase.execute(id, req.body, userId)
      return res
        .status(200)
        .json(successResponse(nota, "Nota de crédito atualizada com sucesso"))
    } catch (err: unknown) {
      return res
        .status(400)
        .json(errorResponse("Falha ao atualizar nota de crédito", err))
    }
  }
}
