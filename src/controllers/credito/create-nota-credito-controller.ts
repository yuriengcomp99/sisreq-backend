import type { Request, Response } from "express"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"
import type { CreateNotaCreditoUseCase } from "../../use-cases/credito/create-nota-credito.js"

export class CreateNotaCreditoController {
  constructor(private useCase: CreateNotaCreditoUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId
      if (!userId) {
        return res.status(401).json(errorResponse("Não autorizado", null))
      }

      const nota = await this.useCase.execute(req.body, userId)
      return res
        .status(201)
        .json(successResponse(nota, "Nota de crédito criada com sucesso"))
    } catch (err: unknown) {
      return res
        .status(400)
        .json(errorResponse("Falha ao criar nota de crédito", err))
    }
  }
}
