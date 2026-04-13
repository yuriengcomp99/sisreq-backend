import bcrypt from "bcrypt"
import { UserRepository } from "../../repositories/user/user-repository.js"
import { userResponseDTO } from "../../dto/user-response-dto.js"

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: any) {
    const { id } = data

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
      "password"
    ]

    const filteredData: any = {}

    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        filteredData[key] = data[key]
      }
    }

    if (filteredData.password) {
      filteredData.password = await bcrypt.hash(filteredData.password, 10)
    }

    const updatedUser = await this.userRepository.update({
      id,
      ...filteredData
    })

    return userResponseDTO(updatedUser)
  }
}