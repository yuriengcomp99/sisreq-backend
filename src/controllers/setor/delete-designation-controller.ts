import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class DeleteDesignationController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      await this.useCase.execute(req.params.id)
      return res
        .status(200)
        .json(successResponse(null, "Setor removido com sucesso"))
    } catch (err: any) {
      return res.status(400).json(errorResponse("Falha ao remover setor", err))
    }
  }
}