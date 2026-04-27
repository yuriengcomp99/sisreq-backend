import { Request, Response } from "express"
import { UpdateRequisicaoUseCase } from "../../use-cases/requisicao/update-requisicao-use-case.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class UpdateRequisicaoController {
  constructor(private updateRequisicaoUseCase: UpdateRequisicaoUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data = req.body

      const requisicao = await this.updateRequisicaoUseCase.execute(id, data)

      return res
        .status(200)
        .json(successResponse(requisicao, "Requisição atualizada com sucesso"))

    } catch (error: any) {

      if (error.message === "ID_REQUIRED") {
        return res.status(400).json(errorResponse("ID é obrigatório", error))
      }

      if (error.message === "NO_DATA_TO_UPDATE") {
        return res
          .status(400)
          .json(errorResponse("Nenhum dado para atualizar", error))
      }

      if (error.message === "REQUISICAO_NOT_FOUND") {
        return res
          .status(404)
          .json(errorResponse("Requisição não encontrada", error))
      }

      if (error.message === "REQUISICAO_DETALHE_NOT_FOUND") {
        return res
          .status(404)
          .json(errorResponse("Item da requisição não encontrado", error))
      }

      return res
        .status(500)
        .json(errorResponse("Erro ao atualizar requisição", error))
    }
  }
}