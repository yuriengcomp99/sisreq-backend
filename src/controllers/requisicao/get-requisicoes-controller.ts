import { Request, Response } from "express"
import { GetRequisicoesUseCase } from "../../use-cases/requisicao/get-requisicoes-usecase.js"

export class GetRequisicoesController {
  constructor(private getRequisicoesUseCase: GetRequisicoesUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const requisicoes = await this.getRequisicoesUseCase.execute()

      return res.status(200).json(requisicoes)
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar requisições",
      })
    }
  }
}