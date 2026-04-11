import { CapacidadeRepository } from "../../repositories/capacidade/capacidade-repository.js"

export class GetCapacidadeUseCase {
  constructor(private repository: CapacidadeRepository) {}

  async execute(description?: string) {
    const data = await this.repository.find(description)

    if (!data || data.length === 0) {
      return []
    }

    return data
  }
}