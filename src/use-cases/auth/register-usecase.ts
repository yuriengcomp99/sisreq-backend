import { UserRepository } from "../../repositories/user/user-repository.js"
import bcrypt from "bcrypt"

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data

    const userExists = await this.userRepository.findByEmail(email)

    if (userExists) {
      throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword
    })

    return user
  }
}