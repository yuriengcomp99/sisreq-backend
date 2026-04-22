import { UserRepository } from "../../repositories/user/user-repository.js"
import { userResponseDTO } from "../../dto/user-response-dto.js"
import bcrypt from "bcrypt"
import { UserRole } from "@prisma/client"

interface RegisterDTO {
  first_name: string
  army_name: string
  graduation: string
  designationId: string
  email: string
  password: string
  role?: UserRole
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: RegisterDTO) {

    const userExists = await this.userRepository.findByEmail(data.email)

    if (userExists) {
      throw new Error("Usuário já cadastrado")
    }

    const allowedFields = [
      "first_name",
      "army_name",
      "graduation",
      "designationId",
      "email",
      "password",
      "role"
    ]

    const filteredData: any = {}

    for (const key of allowedFields) {
      if (data[key as keyof RegisterDTO] !== undefined) {
        filteredData[key] = data[key as keyof RegisterDTO]
      }
    }

    filteredData.password = await bcrypt.hash(filteredData.password, 10)

    filteredData.role = filteredData.role ?? "USER"

    const created = await this.userRepository.create(filteredData)
    const full = await this.userRepository.findById(created.id)
    if (!full) {
      throw new Error("Falha ao carregar usuário criado")
    }
    return userResponseDTO(full)
  }
}