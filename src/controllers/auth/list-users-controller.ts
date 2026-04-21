import { Request, Response } from "express"
import { ListUsersUseCase } from "../../use-cases/auth/list-users-use-case.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class ListUsersController {
  constructor(private listUsersUseCase: ListUsersUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId

      if (!userId) {
        return res.status(401).json(errorResponse("Não autorizado", null))
      }

      const users = await this.listUsersUseCase.execute(userId)

      return res.status(200).json(successResponse(users))
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao listar usuários"

      if (message === "Apenas administradores podem listar todos os usuários.") {
        return res.status(403).json(errorResponse(message, null))
      }

      if (message === "Usuário não encontrado") {
        return res.status(404).json(errorResponse(message, null))
      }

      return res.status(500).json(errorResponse(message, error))
    }
  }
}
