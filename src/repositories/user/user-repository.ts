import { prisma } from "../../database/prisma.js"

interface CreateUserDTO {
  first_name: string
  army_name: string
  graduation: string
  designationId: string
  email: string
  password: string
  role?: string
}

interface UpdateUserDTO {
  id: string
  first_name?: string
  army_name?: string
  graduation?: string
  designationId?: string
  email?: string
  password?: string
}

export class UserRepository {

  async create(data: CreateUserDTO) {
    return prisma.user.create({
      data
    })
  }

  async update(data: UpdateUserDTO) {
    return prisma.user.update({
      where: { id: data.id },
      data: {
        first_name: data.first_name,
        army_name: data.army_name,
        graduation: data.graduation,
        designationId: data.designationId,
        email: data.email,
        password: data.password,
      },
    })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        designation: true
      }
    })
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        designation: true
      }
    })
  }

  async findAllWithDesignation() {
    return prisma.user.findMany({
      include: {
        designation: true,
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  }
}