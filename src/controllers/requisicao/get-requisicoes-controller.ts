import { Request, Response } from "express"
import { GetRequisicoesUseCase } from "../../use-cases/requisicao/get-requisicoes-usecase.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class GetRequisicoesController {
  constructor(private getRequisicoesUseCase: GetRequisicoesUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const requisicoes = await this.getRequisicoesUseCase.execute()

      return res.status(200).json(successResponse(requisicoes))
    } catch (error) {
      return res
        .status(500)
        .json(errorResponse("Erro ao buscar requisições", error))
    }
  }
}