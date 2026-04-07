import { Request, Response } from "express"
import { RegisterUseCase } from "../../use-cases/auth/register-usecase.js"

export class RegisterController {
  constructor(private registerUseCase: RegisterUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      const user = await this.registerUseCase.execute({
        name,
        email,
        password
      })

      return res.status(201).json(user)

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      })
    }
  }
}