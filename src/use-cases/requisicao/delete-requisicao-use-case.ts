import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"

export class DeleteRequisicaoUseCase {
  constructor(private requisicaoRepository: RequisicaoRepository) {}

  async execute(id: number) {
    if (!id) {
        throw new Error("ID_REQUIRED")
    }

    try {
        return await this.requisicaoRepository.deleteById(id)
    } catch (error: any) {
        if (error.code === "P2025") {
        throw new Error("REQUISICAO_NOT_FOUND")
        }

        throw error
    }
  }
}