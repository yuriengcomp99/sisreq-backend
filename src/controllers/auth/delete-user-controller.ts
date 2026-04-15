import { Request, Response } from "express"
import { DeleteUserUseCase } from "../../use-cases/auth/delete-user-use-case.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { userId } = req as Request & { userId?: string }

      if (!userId) {
        return res.status(401).json(errorResponse("Unauthorized"))
      }

      await this.deleteUserUseCase.execute(userId)

      return res
        .status(200)
        .json(successResponse(null, "Usuário removido com sucesso"))
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message, error))
    }
  }
}