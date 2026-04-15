import { Request, Response } from "express"
import { GetRequisicaoByIdUseCase } from "../../use-cases/requisicao/get-requisicao-by-id-use-case.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class GetRequisicaoByIdController {
  constructor(private useCase: GetRequisicaoByIdUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params

      const requisicao = await this.useCase.execute(id)

      return res.status(200).json(successResponse(requisicao))

    } catch (error: any) {
      return res
        .status(404)
        .json(errorResponse("Requisição não encontrada", error))
    }
  }
}