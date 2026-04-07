import { UserRepository } from "../../repositories/user/user-repository.js"

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }
}