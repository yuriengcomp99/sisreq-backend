import type { Request, Response } from "express"
import type { UpdateUserUseCase } from "../../use-cases/auth/update-user-use-case.js"
import { errorResponse, successResponse } from "../../helpers/api-response.js"

export class AdminUpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0]
      if (!id) {
        return res.status(400).json(errorResponse("ID inválido", null))
      }
      const dados = await this.updateUserUseCase.execute(
        { id, ...req.body },
        { allowRoleChange: true }
      )
      return res
        .status(200)
        .json(successResponse(dados, "Usuário atualizado com sucesso"))
    } catch (error: unknown) {
      return res
        .status(400)
        .json(errorResponse("Falha ao atualizar usuário", error))
    }
  }
}
