import { Request, Response } from "express"
import { GetUnreadNotificationsCountUseCase } from "../use-case/get-unread-notifications-count-use-case.js"
import {
  errorResponse,
  successResponse,
} from "../../../helpers/api-response.js"

export class GetUnreadNotificationsCountController {
  constructor(private useCase: GetUnreadNotificationsCountUseCase) {}

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
        successResponse(dados, "Contagem de notificações não lidas")
      )
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json(errorResponse("Erro ao contar notificações não lidas", error))
    }
  }
}
