import type { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import type { UserRepository } from "../../repositories/user/user-repository.js"

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

    return nota
  }
}
