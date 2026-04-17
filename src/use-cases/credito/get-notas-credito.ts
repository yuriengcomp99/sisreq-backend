import type { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import type { UserRepository } from "../../repositories/user/user-repository.js"

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
    return this.repository.findAllForUserScope(requesterId, user.role)
  }
}
