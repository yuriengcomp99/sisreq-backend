import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"

export class UpdateRequisicaoUseCase {
  constructor(private requisicaoRepository: RequisicaoRepository) {}

  async execute(id: string, data: any) {
    if (!id) {
      throw new Error("ID_REQUIRED")
    }
    
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    )

    if (Object.keys(filteredData).length === 0) {
      throw new Error("NO_DATA_TO_UPDATE")
    }

    try {
      return await this.requisicaoRepository.updateById(id, filteredData)
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error("REQUISICAO_NOT_FOUND")
      }

      throw error
    }
  }
}