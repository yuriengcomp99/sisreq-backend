import { Request, Response } from "express"
import { GetUserProfileUseCase } from "../../use-cases/auth/get-user-use-case.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class GetUserProfileController {
  constructor(private getUserProfileUseCase: GetUserProfileUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { userId } = req as Request & { userId?: string }

      if (!userId) {
        return res.status(401).json(errorResponse("Unauthorized"))
      }

      const user = await this.getUserProfileUseCase.execute(userId)

      return res.status(200).json(successResponse(user))
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message, error))
    }
  }
}