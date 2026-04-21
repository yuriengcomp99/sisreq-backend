import type { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import type { UserRepository } from "../../repositories/user/user-repository.js"
import { notaCreditoComResumoDTO } from "../../dto/nota-credito-com-resumo-dto.js"

export class GetNotaCreditoByIdUseCase {
  constructor(
    private repository: NotaCreditoRepository,
    private userRepository: UserRepository
  ) {}

  async execute(id: string, requesterId: string) {
    const user = await this.userRepository.findById(requesterId)
    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    const nota = await this.repository.findByIdScoped(id, requesterId, user.role)

    if (!nota) {
      throw new Error("Nota de crédito não encontrada")
    }

    const [usage] = await this.repository.getRequisicaoUsageByNotaCreditoIds([
      nota.id,
    ])
    const stats = usage
      ? {
          requisicaoCount: Number(usage.requisicaoCount),
          valorTotalRequisicoes: Number(usage.valorTotalRequisicoes),
        }
      : { requisicaoCount: 0, valorTotalRequisicoes: 0 }

    return notaCreditoComResumoDTO(nota, stats)
  }
}
