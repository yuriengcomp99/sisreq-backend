import { Request, Response } from "express"
import { RefreshTokenUseCase } from "../../use-cases/auth/refresh-token-usecase.js"
import { errorResponse, successResponse } from "../../helpers/api-response.js"
import { refreshCookieName } from "../../config/auth-cookie.js"

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const refreshFromCookie = req.cookies[refreshCookieName]
      const result = await this.refreshTokenUseCase.execute(refreshFromCookie)
      return res
        .status(200)
        .json(successResponse(result, "Access token renovado"))
    } catch (error: unknown) {
      return res
        .status(401)
        .json(errorResponse("Não foi possível renovar o token", error))
    }
  }
}
