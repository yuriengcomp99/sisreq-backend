import type { DashboardRepository } from "../../repositories/dashboard/dashboard-repository.js"

export class GetDashboardResumoUseCase {
  constructor(private repository: DashboardRepository) {}

  async execute() {
    return this.repository.getResumo()
  }
}
