import { prisma } from "../../database/prisma.js"

export class NotaCreditoRepository {

  async create(data: any) {
    return prisma.notaCredito.create({ data })
  }

  async findAll() {
    return prisma.notaCredito.findMany({
      orderBy: { createdAt: "desc" }
    })
  }

  async findById(id: string) {
    return prisma.notaCredito.findUnique({
      where: { id },
      include: {
        requisicoes: true
      }
    })
  }

  async update(id: string, data: any) {
    return prisma.notaCredito.update({
      where: { id },
      data
    })
  }

  async delete(id: string) {
    return prisma.notaCredito.delete({
      where: { id }
    })
  }
}