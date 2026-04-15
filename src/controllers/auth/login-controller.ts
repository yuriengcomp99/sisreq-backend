import { Request, Response } from "express"
import { LoginUseCase } from "../../use-cases/auth/login-usecase.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const result = await this.loginUseCase.execute(req.body)

      return res.status(200).json(successResponse(result, "Login realizado com sucesso"))
    } catch (error: any) {
      return res
        .status(401)
        .json(errorResponse("Falha ao realizar login", error))
    }
  }
}