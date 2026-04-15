import { Request, Response } from "express"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class RequisicaoController {
  constructor(private createUseCase: any) {}

  async create(req: Request, res: Response) {
    try {
      const result = await this.createUseCase.execute(req.body)

      return res
        .status(201)
        .json(successResponse(result, "Requisição criada com sucesso"))
    } catch (error) {
      console.error(error)
      return res.status(500).json(errorResponse("Erro ao criar requisição", error))
    }
  }
}