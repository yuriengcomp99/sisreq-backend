import { Request, Response } from "express"
import {
  LoginPayloadInvalidError,
  LoginUseCase,
} from "../../use-cases/auth/login-usecase.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"
import {
  getRefreshCookieOptions,
  refreshCookieName,
} from "../../config/auth-cookie.js"

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { refreshToken, ...loginResponse } = await this.loginUseCase.execute(req.body)

      res.cookie(refreshCookieName, refreshToken, getRefreshCookieOptions())

      return res
        .status(200)
        .json(successResponse(loginResponse, "Login realizado com sucesso"))
    } catch (error: unknown) {
      if (error instanceof LoginPayloadInvalidError) {
        return res.status(400).json(errorResponse(error.message, null))
      }
      return res
        .status(401)
        .json(errorResponse("Falha ao realizar login", error))
    }
  }
}