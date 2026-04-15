import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class GetNotaCreditoByIdController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const nota = await this.useCase.execute(req.params.id)
      return res.status(200).json(successResponse(nota))
    } catch (err: any) {
      return res
        .status(404)
        .json(errorResponse("Nota de crédito não encontrada", err))
    }
  }
}