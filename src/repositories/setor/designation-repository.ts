import { prisma } from "../../database/prisma.js"

export class DesignationRepository {

  async create(data: any) {
    return prisma.designation.create({ data })
  }

  async findAll() {
    return prisma.designation.findMany({
      orderBy: { createdAt: "desc" }
    })
  }

  async findById(id: string) {
    return prisma.designation.findUnique({
      where: { id },
      include: {
        users: true
      }
    })
  }

  async update(id: string, data: any) {
    return prisma.designation.update({
      where: { id },
      data
    })
  }

  async delete(id: string) {
    return prisma.designation.delete({
      where: { id }
    })
  }
}