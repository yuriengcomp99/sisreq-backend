import { prisma } from "../../database/prisma.js"

export class RequisicaoRepository {
  async create(data: any) {
    return prisma.requisicao.create({
      data: {
        ...data,
        detalhes: {
          create: data.detalhes
        }
      },
      include: {
        detalhes: true
      }
    })
  }
  async findAll() {
    return prisma.requisicao.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  }
  async deleteById(id: string) {
  return prisma.requisicao.delete({
    where: {
      id,
    },
  })
}
}