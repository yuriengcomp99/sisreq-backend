import { Request, Response } from "express"
import { GetPregaoByUggUseCase } from "../../use-cases/ata/get-pregao-by-ugg-usecase.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class GetPregaoByUggController {
  constructor(private useCase: GetPregaoByUggUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { pregao, ugg } = req.params
      const pregaoParam = Array.isArray(pregao) ? pregao[0] : pregao
      const uggParam = Array.isArray(ugg) ? ugg[0] : ugg

      const result = await this.useCase.execute(pregaoParam, uggParam)

      return res.status(200).json(successResponse(result))
    } catch (error) {
      return res
        .status(404)
        .json(
          errorResponse(
            error instanceof Error ? error.message : "Erro interno",
            error,
          ),
        )
    }
  }
}