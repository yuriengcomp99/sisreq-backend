import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"

export class DeleteRequisicaoUseCase {
  constructor(private requisicaoRepository: RequisicaoRepository) {}

  async execute(id: number) {
    if (!id) {
      throw new Error("ID é obrigatório")
    }

    const requisicao = await this.requisicaoRepository.deleteById(id)

    return requisicao
  }
}