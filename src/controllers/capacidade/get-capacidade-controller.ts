import { Request, Response } from "express"
import { GetCapacidadeUseCase } from "../../use-cases/capacidade/get-capacidade-usecase.js"
import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class GetCapacidadeController {
  constructor(private useCase: GetCapacidadeUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { description } = req.query
      const descriptionParam = Array.isArray(description)
        ? typeof description[0] === "string"
          ? description[0]
          : undefined
        : typeof description === "string"
          ? description
          : undefined

      const result = await this.useCase.execute(descriptionParam)

      return res.status(200).json(successResponse(result))
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json(errorResponse("Erro ao buscar capacidade", error))
    }
  }
}