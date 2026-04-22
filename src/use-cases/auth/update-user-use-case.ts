import bcrypt from "bcrypt"
import { UserRepository } from "../../repositories/user/user-repository.js"
import { userResponseDTO } from "../../dto/user-response-dto.js"

export type UpdateUserUseCaseOptions = {
  allowRoleChange?: boolean
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: any, options: UpdateUserUseCaseOptions = {}) {
    const { id } = data
    const { allowRoleChange = false } = options

    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new Error("User not found")
    }

    if (data.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(data.email)

      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new Error("Email already in use. Please use another email.")
      }
    }

    const allowedFields = [
      "first_name",
      "army_name",
      "graduation",
      "designationId",
      "email",
      "password",
      ...(allowRoleChange ? (["role"] as const) : []),
    ]

    const filteredData: Record<string, unknown> = {}

    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        filteredData[key] = data[key]
      }
    }

    if (typeof filteredData.password === "string" && filteredData.password) {
      filteredData.password = await bcrypt.hash(filteredData.password, 10)
    }

    await this.userRepository.update({
      id,
      ...(filteredData as Record<string, string | undefined>),
    })

    const userWithRelations = await this.userRepository.findById(id)
    if (!userWithRelations) {
      throw new Error("User not found")
    }

    return userResponseDTO(userWithRelations)
  }
}