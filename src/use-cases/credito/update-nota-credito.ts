import type { Prisma } from "@prisma/client"
import type { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import type { UserRepository } from "../../repositories/user/user-repository.js"

export class UpdateNotaCreditoUseCase {
  constructor(
    private repository: NotaCreditoRepository,
    private userRepository: UserRepository
  ) {}

  async execute(
    id: string,
    data: Prisma.NotaCreditoUpdateInput,
    requesterId: string
  ) {
    const user = await this.userRepository.findById(requesterId)
    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    const existing = await this.repository.findByIdScoped(id, requesterId, user.role)
    if (!existing) {
      throw new Error("Nota de crédito não encontrada")
    }

    return this.repository.update(id, data)
  }
}
