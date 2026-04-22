import type { Request, Response } from "express"
import type { GetUserByIdAdminUseCase } from "../../use-cases/auth/get-user-by-id-admin-use-case.js"
import { errorResponse, successResponse } from "../../helpers/api-response.js"

export class GetUserByIdAdminController {
  constructor(private useCase: GetUserByIdAdminUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0]
      if (!id) {
        return res.status(400).json(errorResponse("ID inválido", null))
      }
      const dados = await this.useCase.execute(id)
      return res.status(200).json(successResponse(dados))
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao buscar usuário"
      if (message === "Usuário não encontrado") {
        return res.status(404).json(errorResponse(message, null))
      }
      return res.status(500).json(errorResponse(message, error))
    }
  }
}
