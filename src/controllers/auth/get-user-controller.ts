import { Request, Response } from "express"
import { GetUserProfileUseCase } from "../../use-cases/auth/get-user-use-case.js"

export class GetUserProfileController {
  constructor(private getUserProfileUseCase: GetUserProfileUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId

      if (!userId) {
        return res.status(401).json({
          error: "Unauthorized",
        })
      }

      const user = await this.getUserProfileUseCase.execute(userId)

      return res.json(user)

    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      })
    }
  }
}