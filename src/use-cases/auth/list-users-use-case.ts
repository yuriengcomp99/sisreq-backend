import { UserRole } from "@prisma/client"
import { UserRepository } from "../../repositories/user/user-repository.js"
import { userResponseDTO } from "../../dto/user-response-dto.js"

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(requesterId: string) {
    const requester = await this.userRepository.findById(requesterId)
    if (!requester) {
      throw new Error("Usuário não encontrado")
    }
    if (requester.role !== UserRole.ADMIN) {
      throw new Error("Apenas administradores podem listar todos os usuários.")
    }

    const users = await this.userRepository.findAllWithDesignation()
    return users.map((u) => userResponseDTO(u))
  }
}
