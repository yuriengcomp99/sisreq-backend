import { DashboardRepository } from "../../repositories/dashboard/dashboard-repository.js"
import { GetDashboardResumoUseCase } from "../../use-cases/dashboard/get-dashboard-resumo-use-case.js"
import { GetDashboardResumoController } from "../../controllers/dashboard/get-dashboard-resumo-controller.js"

export function makeGetDashboardResumoController() {
  const repository = new DashboardRepository()
  const useCase = new GetDashboardResumoUseCase(repository)
  return new GetDashboardResumoController(useCase)
}
