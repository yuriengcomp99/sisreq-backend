import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class CreateNotaCreditoController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const nota = await this.useCase.execute(req.body)
      return res
        .status(201)
        .json(successResponse(nota, "Nota de crédito criada com sucesso"))
    } catch (err: any) {
      return res
        .status(400)
        .json(errorResponse("Falha ao criar nota de crédito", err))
    }
  }
}