import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class UpdateDesignationController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const result = await this.useCase.execute(req.params.id, req.body)
      return res
        .status(200)
        .json(successResponse(result, "Setor atualizado com sucesso"))
    } catch (err: any) {
      return res.status(400).json(errorResponse("Falha ao atualizar setor", err))
    }
  }
}