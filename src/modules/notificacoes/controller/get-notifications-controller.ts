import { Request, Response } from "express"
import { GetNotificationsUseCase } from "../use-case/get-notifications-use-case.js"
import {
  errorResponse,
  successResponse,
} from "../../../helpers/api-response.js"

export class GetNotificationsController {
  constructor(private useCase: GetNotificationsUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = req.userId
      if (!userId) {
        return res
          .status(401)
          .json(errorResponse("Usuário não autenticado", null))
      }

      const dados = await this.useCase.execute(userId)

      return res
        .status(200)
        .json(successResponse(dados, "Notificações listadas com sucesso"))
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json(errorResponse("Erro ao buscar notificações", error))
    }
  }
}
