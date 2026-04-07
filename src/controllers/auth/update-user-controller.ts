import { Request, Response } from "express"
import { UpdateUserUseCase } from "../../use-cases/auth/update-user-use-case.js"

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const id = req.userId

      if (!id) {
        return res.status(401).json({
          error: "Unauthorized",
        })
      }

      const { name, email, password } = req.body

      const user = await this.updateUserUseCase.execute({
        id,
        name,
        email,
        password,
      })

      const { password: _, ...userWithoutPassword } = user

      return res.json(userWithoutPassword)
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      })
    }
  }
}