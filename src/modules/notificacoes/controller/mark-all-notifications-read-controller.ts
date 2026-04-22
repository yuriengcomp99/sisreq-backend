import { Request, Response } from "express"
import { MarkAllNotificationsReadUseCase } from "../use-case/mark-all-notifications-read-use-case.js"
import {
  errorResponse,
  successResponse,
} from "../../../helpers/api-response.js"

export class MarkAllNotificationsReadController {
  constructor(private useCase: MarkAllNotificationsReadUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId
      if (!userId) {
        return res
          .status(401)
          .json(errorResponse("Usuário não autenticado", null))
      }

      const dados = await this.useCase.execute(userId)

      return res.status(200).json(
        successResponse(
          dados,
          "Todas as notificações foram marcadas como lidas"
        )
      )
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json(errorResponse("Erro ao marcar notificações como lidas", error))
    }
  }
}
