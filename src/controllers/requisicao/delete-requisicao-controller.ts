import { Request, Response } from "express"
import { DeleteRequisicaoUseCase } from "../../use-cases/requisicao/delete-requisicao-use-case.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class DeleteRequisicaoController {
  constructor(private deleteRequisicaoUseCase: DeleteRequisicaoUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params

      const requisicao = await this.deleteRequisicaoUseCase.execute(id)

      return res
        .status(200)
        .json(successResponse(requisicao, "Requisição removida com sucesso"))

    } catch (error: any) {
      if (error.message === "REQUISICAO_NOT_FOUND") {
        return res
          .status(404)
          .json(errorResponse("Requisição não encontrada", error))
      }

      if (error.message === "ID_REQUIRED") {
        return res.status(400).json(errorResponse("ID é obrigatório", error))
      }

      return res
        .status(500)
        .json(errorResponse("Erro ao deletar requisição", error))
    }
  }
}