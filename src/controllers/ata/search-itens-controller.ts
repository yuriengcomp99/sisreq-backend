import { Request, Response } from "express"
import { SearchItensUseCase } from "../../use-cases/ata/search-itens-usecase.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class SearchItensController {
  constructor(private useCase: SearchItensUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { pregao, ugg } = req.params
      const { search } = req.query

      const pregaoParam = Array.isArray(pregao) ? pregao[0] : pregao
      const uggParam = Array.isArray(ugg) ? ugg[0] : ugg
      const searchParam = Array.isArray(search)
        ? typeof search[0] === "string"
          ? search[0]
          : undefined
        : typeof search === "string"
          ? search
          : undefined

      const result = await this.useCase.execute(pregaoParam, uggParam, searchParam)

      return res.status(200).json(successResponse(result))
    } catch (error) {
      return res
        .status(500)
        .json(errorResponse("Erro ao buscar itens", error))
    }
  }
}