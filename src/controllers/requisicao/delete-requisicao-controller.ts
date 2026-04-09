import { Request, Response } from "express"
import { DeleteRequisicaoUseCase } from "../../use-cases/requisicao/delete-requisicao-use-case.js"

export class DeleteRequisicaoController {
  constructor(private deleteRequisicaoUseCase: DeleteRequisicaoUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params

      const requisicao = await this.deleteRequisicaoUseCase.execute(Number(id))

      return res.status(200).json(requisicao)
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao deletar requisição",
      })
    }
  }
}