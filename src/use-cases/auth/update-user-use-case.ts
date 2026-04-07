import bcrypt from "bcrypt"
import { UserRepository } from "../../repositories/user/user-repository.js"

interface UpdateUserRequest {
  id: string
  name?: string
  email?: string
  password?: string
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ id, name, email, password }: UpdateUserRequest) {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new Error("User not found")
    }
    
    if (email) {
      const userWithSameEmail = await this.userRepository.findByEmail(email)

      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new Error("Email already in use. Please use another email.")
      }
    }

    let hashedPassword: string | undefined

    if (password) {
      hashedPassword = await bcrypt.hash(password, 6)
    }

    const updatedUser = await this.userRepository.update({
      id,
      name,
      email,
      password: hashedPassword,
    })

    return updatedUser
  }
}