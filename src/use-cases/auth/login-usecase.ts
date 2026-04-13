import { UserRepository } from "../../repositories/user/user-repository.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userResponseDTO } from "../../dto/user-response-dto.js"

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: { email: string; password: string }) {
    const { email, password } = data

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new Error("Dados Incorretos")
    }


    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error("Dados Incorretos")
    }

    const token = jwt.sign(
      {},
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "15m",
      }
    )

    return {
      accessToken: token,
      user: userResponseDTO(user)
    }
  }
}