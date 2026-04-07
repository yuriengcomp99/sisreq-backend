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
}