import type { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import type { UserRepository } from "../../repositories/user/user-repository.js"
import { notaCreditoComResumoDTO } from "../../dto/nota-credito-com-resumo-dto.js"

export class GetNotasCreditoUseCase {
  constructor(
    private repository: NotaCreditoRepository,
    private userRepository: UserRepository
  ) {}

  async execute(requesterId: string) {
    const user = await this.userRepository.findById(requesterId)
    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    const notas = await this.repository.findAllForUserScope(
      requesterId,
      user.role
    )
    const ids = notas.map((n) => n.id)
    const usages = await this.repository.getRequisicaoUsageByNotaCreditoIds(ids)
    const usageByNota = new Map(
      usages.map((u) => [
        u.notaCreditoId,
        {
          requisicaoCount: Number(u.requisicaoCount),
          valorTotalRequisicoes: Number(u.valorTotalRequisicoes),
        },
      ])
    )

    return notas.map((nota) => {
      const stats = usageByNota.get(nota.id) ?? {
        requisicaoCount: 0,
        valorTotalRequisicoes: 0,
      }
      return notaCreditoComResumoDTO(nota, stats)
    })
  }
}
