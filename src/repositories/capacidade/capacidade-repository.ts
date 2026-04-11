import { prisma } from "../../database/prisma.js"

export class CapacidadeRepository {
  async find(description?: string) {
    const data = await prisma.ataItem.findMany({
      where: description
        ? {
            descricao: {
              contains: description,
              mode: "insensitive",
            },
            qtdSaldo: {
              gt: 0, 
            },
          }
        : {
            qtdSaldo: {
              gt: 0,
            },
          },
      orderBy: {
        fornecedor: "asc",
      },
    })

    return data
  }
}