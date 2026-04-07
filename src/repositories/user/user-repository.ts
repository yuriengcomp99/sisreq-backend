import { prisma } from "../../database/prisma.js"

interface UpdateUserDTO {
  id: string
  name?: string
  email?: string
  password?: string
}

export class UserRepository {
  async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data,
    })
  }

  async update(data: UpdateUserDTO) {
    return prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  async delete(id: string) {
  return prisma.user.delete({
    where: { id },
  })
}
}