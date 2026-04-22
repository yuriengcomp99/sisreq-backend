import type { Request, Response } from "express"
import type { DeleteUserUseCase } from "../../use-cases/auth/delete-user-use-case.js"
import { errorResponse, successResponse } from "../../helpers/api-response.js"

export class AdminDeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0]
      if (!id) {
        return res.status(400).json(errorResponse("ID inválido", null))
      }

      if (id === req.userId) {
        return res
          .status(400)
          .json(
            errorResponse(
              "Não é possível excluir o próprio usuário por este endpoint.",
              null
            )
          )
      }

      await this.deleteUserUseCase.execute(id)
      return res
        .status(200)
        .json(successResponse(null, "Usuário removido com sucesso"))
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Falha ao remover usuário"
      if (message === "User not found") {
        return res.status(404).json(errorResponse("Usuário não encontrado", null))
      }
      return res.status(400).json(errorResponse(message, error))
    }
  }
}
