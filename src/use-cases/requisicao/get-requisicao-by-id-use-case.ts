import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"

export class GetRequisicaoByIdUseCase {
  constructor(private requisicaoRepository: RequisicaoRepository) {}

  async execute(id: string) {
    const requisicao = await this.requisicaoRepository.findById(id)

    if (!requisicao) {
      throw new Error("Requisição não encontrada")
    }

    return requisicao
  }
}