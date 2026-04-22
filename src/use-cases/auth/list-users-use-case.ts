import { UserRepository } from "../../repositories/user/user-repository.js"
import { userResponseDTO } from "../../dto/user-response-dto.js"

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    const users = await this.userRepository.findAllWithDesignation()
    return users.map((u) => userResponseDTO(u))
  }
}
