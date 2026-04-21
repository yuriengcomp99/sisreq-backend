import type { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import type { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"
import type { UserRepository } from "../../repositories/user/user-repository.js"
import { notaCreditoComResumoDTO } from "../../dto/nota-credito-com-resumo-dto.js"

export class GetNotaCreditoRequisicoesUseCase {
  constructor(
    private notaCreditoRepository: NotaCreditoRepository,
    private requisicaoRepository: RequisicaoRepository,
    private userRepository: UserRepository
  ) {}

  async execute(notaCreditoId: string, requesterId: string) {
    const user = await this.userRepository.findById(requesterId)
    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    const nota = await this.notaCreditoRepository.findByIdScoped(
      notaCreditoId,
      requesterId,
      user.role
    )

    if (!nota) {
      throw new Error("Nota de crédito não encontrada")
    }

    const [usage] =
      await this.notaCreditoRepository.getRequisicaoUsageByNotaCreditoIds([
        nota.id,
      ])
    const stats = usage
      ? {
          requisicaoCount: Number(usage.requisicaoCount),
          valorTotalRequisicoes: Number(usage.valorTotalRequisicoes),
        }
      : { requisicaoCount: 0, valorTotalRequisicoes: 0 }

    const requisicoes =
      await this.requisicaoRepository.findByNotaCreditoIdSemDetalhes(nota.id)

    return {
      nota: notaCreditoComResumoDTO(nota, stats),
      requisicoes,
    }
  }
}
