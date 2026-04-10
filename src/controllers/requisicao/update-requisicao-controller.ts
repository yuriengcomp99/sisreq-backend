import { Request, Response } from "express"
import { UpdateRequisicaoUseCase } from "../../use-cases/requisicao/update-requisicao-use-case.js"

export class UpdateRequisicaoController {
  constructor(private updateRequisicaoUseCase: UpdateRequisicaoUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data = req.body

      const requisicao = await this.updateRequisicaoUseCase.execute(id, data)

      return res.status(200).json(requisicao)

    } catch (error: any) {

      if (error.message === "ID_REQUIRED") {
        return res.status(400).json({ message: "ID é obrigatório" })
      }

      if (error.message === "NO_DATA_TO_UPDATE") {
        return res.status(400).json({ message: "Nenhum dado para atualizar" })
      }

      if (error.message === "REQUISICAO_NOT_FOUND") {
        return res.status(404).json({ message: "Requisição não encontrada" })
      }

      return res.status(500).json({
        message: "Erro ao atualizar requisição",
      })
    }
  }
}