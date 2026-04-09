import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"

export class GetRequisicoesUseCase {
  constructor(private requisicaoRepository: RequisicaoRepository) {}

  async execute() {
    const requisicoes = await this.requisicaoRepository.findAll()

    return requisicoes
  }
}