import { Request, Response } from "express"
import { SearchItensUseCase } from "../../use-cases/ata/search-itens-usecase.js"

export class SearchItensController {
  constructor(private useCase: SearchItensUseCase) {}

  async handle(req: Request, res: Response) {
    const { pregao, ugg } = req.params
    const { search } = req.query

    const result = await this.useCase.execute(
      pregao,
      ugg,
      search as string
    )

    return res.json(result)
  }
}