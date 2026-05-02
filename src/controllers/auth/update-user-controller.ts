import { Request, Response } from "express"
import { UpdateUserUseCase } from "../../use-cases/auth/update-user-use-case.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const id = req.userId

      if (!id) {
        return res.status(401).json(errorResponse("Não autorizado", null))
      }

      const body = { ...(req.body as Record<string, unknown>) }
      delete body.role
      delete body.designationId

      const user = await this.updateUserUseCase.execute(
        { id, ...body },
        { allowRoleChange: false }
      )

      return res
        .status(200)
        .json(successResponse(user, "Usuário atualizado com sucesso"))
    } catch (error: any) {
      return res.status(400).json(errorResponse("Falha ao atualizar usuário", error))
    }
  }
}