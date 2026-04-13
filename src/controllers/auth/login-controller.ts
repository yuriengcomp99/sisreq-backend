import { Request, Response } from "express"
import { LoginUseCase } from "../../use-cases/auth/login-usecase.js"

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(req: Request, res: Response) {
    try {

      const result = await this.loginUseCase.execute(req.body)

      return res.json(result)

    } catch (error: any) {
      return res.status(401).json({
        error: error.message
      })
    }
  }
}