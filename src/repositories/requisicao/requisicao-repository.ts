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
  /**
   * Lista requisições sem carregar itens (`detalhes`); inclui `valorTotal`
   * (soma de `valor_total` dos detalhes). GET por id continua com `detalhes` completos.
   */
  async findAll() {
    const rows = await prisma.requisicao.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        detalhes: {
          select: { valor_total: true },
        },
      },
    })

    return rows.map(({ detalhes, ...requisicao }) => ({
      ...requisicao,
      valorTotal: detalhes.reduce((acc, d) => acc + d.valor_total, 0),
    }))
  }
  async deleteById(id: string) {
    return prisma.requisicao.delete({
      where: {
        id,
      },
    })
  }
  async updateById(id: string, data: any) {
    return prisma.requisicao.update({
      where: {
        id,
      },
      data,
    })
  }
  async findById(id: string) {
    return prisma.requisicao.findUnique({
      where: { id },
      include: {
        detalhes: true,
        notaCredito: true // 🔥 importante
      }
    })
  }

  /** Requisições vinculadas à nota, sem carregar itens (detalhes). */
  async findByNotaCreditoIdSemDetalhes(notaCreditoId: string) {
    return prisma.requisicao.findMany({
      where: { notaCreditoId },
      orderBy: { createdAt: "desc" },
    })
  }
}