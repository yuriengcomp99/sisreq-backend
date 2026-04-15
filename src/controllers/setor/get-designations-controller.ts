import {
  errorResponse,
  successResponse,
} from "../../helpers/api-response.js"

export class GetDesignationsController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const result = await this.useCase.execute()
      return res.status(200).json(successResponse(result))
    } catch (err: any) {
      return res
        .status(500)
        .json(errorResponse("Falha ao buscar setores", err))
    }
  }
}