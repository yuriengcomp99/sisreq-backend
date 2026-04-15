import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class CreateDesignationController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const result = await this.useCase.execute(req.body)
      return res
        .status(201)
        .json(successResponse(result, "Setor criado com sucesso"))
    } catch (err: any) {
      return res.status(400).json(errorResponse("Falha ao criar setor", err))
    }
  }
}