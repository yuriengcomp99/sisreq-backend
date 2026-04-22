import type { Request, Response } from "express"
import type { GetDashboardResumoUseCase } from "../../use-cases/dashboard/get-dashboard-resumo-use-case.js"
import { errorResponse, successResponse } from "../../helpers/api-response.js"

export class GetDashboardResumoController {
  constructor(private useCase: GetDashboardResumoUseCase) {}

  async handle(_req: Request, res: Response) {
    try {
      const dados = await this.useCase.execute()
      return res
        .status(200)
        .json(successResponse(dados, "Resumo do dashboard"))
    } catch (error) {
      return res
        .status(500)
        .json(errorResponse("Erro ao carregar dashboard", error))
    }
  }
}
