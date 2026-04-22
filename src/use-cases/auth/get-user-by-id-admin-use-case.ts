import { UserRepository } from "../../repositories/user/user-repository.js"
import { userResponseDTO } from "../../dto/user-response-dto.js"

export class GetUserByIdAdminUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new Error("Usuário não encontrado")
    }
    return userResponseDTO(user)
  }
}
