import { Request, Response } from "express"
import { GetPregoesUseCase } from "../../use-cases/ata/get-pregoes-usecase.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class GetPregoesController {
  constructor(private useCase: GetPregoesUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const data = await this.useCase.execute()

      return res.status(200).json(successResponse(data))
    } catch (error) {
      console.error(error)

      return res
        .status(500)
        .json(errorResponse("Erro ao buscar pregões", error))
    }
  }
}