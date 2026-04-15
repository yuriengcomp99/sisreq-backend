import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class GetDesignationByIdController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const result = await this.useCase.execute(req.params.id)
      return res.status(200).json(successResponse(result))
    } catch (err: any) {
      return res
        .status(404)
        .json(errorResponse("Setor não encontrado", err))
    }
  }
}