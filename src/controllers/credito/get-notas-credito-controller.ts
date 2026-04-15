import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class GetNotasCreditoController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const notas = await this.useCase.execute()
      return res.status(200).json(successResponse(notas))
    } catch (err: any) {
      return res
        .status(500)
        .json(errorResponse("Falha ao buscar notas de crédito", err))
    }
  }
}