import { UserRepository } from "../../repositories/user/user-repository.js"
import bcrypt from "bcrypt"
import { userResponseDTO } from "../../dto/user-response-dto.js"
import { signAccessToken, signRefreshToken } from "../../helpers/auth/jwt-tokens.js"

export class LoginPayloadInvalidError extends Error {
  constructor() {
    super("Informe email e senha válidos")
    this.name = "LoginPayloadInvalidError"
  }
}

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: { email: string; password: string }) {
    const email = data?.email
    const password = data?.password

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      password.length === 0
    ) {
      throw new LoginPayloadInvalidError()
    }

    const user = await this.userRepository.findByEmail(email.trim())

    if (!user) {
      throw new Error("Dados Incorretos")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error("Dados Incorretos")
    }

    const accessToken = signAccessToken(user.id)
    const refreshToken = signRefreshToken(user.id)

    return {
      accessToken,
      refreshToken,
      user: userResponseDTO(user),
    }
  }
}
