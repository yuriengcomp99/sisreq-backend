import { Request, Response } from "express"
import { DeleteUserUseCase } from "../../use-cases/auth/delete-user-use-case.js"

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId

      if (!userId) {
        return res.status(401).json({
          error: "Unauthorized",
        })
      }

      await this.deleteUserUseCase.execute(userId)

      return res.status(204).send()

    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      })
    }
  }
}