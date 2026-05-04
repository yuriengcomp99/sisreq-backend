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
    const requisicao = await prisma.requisicao.findUnique({
      where: { id },
      include: {
        detalhes: true,
        notaCredito: true 
      }
    })

    if (!requisicao) {
      return null
    }

    const itemNumbers = Array.from(
      new Set(requisicao.detalhes.map((detalhe) => detalhe.nr_item))
    )

    if (itemNumbers.length === 0) {
      return requisicao
    }

    const ataItems = await prisma.ataItem.findMany({
      where: {
        pregao: requisicao.nr_pregao,
        nrItem: { in: itemNumbers },
      },
      select: {
        nrItem: true,
        fornecedor: true,
      },
    })

    const fornecedorByNrItem = new Map<string, string>()
    for (const item of ataItems) {
      if (!fornecedorByNrItem.has(item.nrItem)) {
        fornecedorByNrItem.set(item.nrItem, item.fornecedor)
      }
    }

    return {
      ...requisicao,
      detalhes: requisicao.detalhes.map((detalhe) => ({
        ...detalhe,
        fornecedor: fornecedorByNrItem.get(detalhe.nr_item) ?? null,
      })),
    }
  }

  async findByIdForDocument(id: string) {
    const requisicao = await prisma.requisicao.findUnique({
      where: { id },
      include: {
        detalhes: { orderBy: { createdAt: "asc" } },
        notaCredito: true,
        user: {
          select: {
            first_name: true,
            army_name: true,
            graduation: true,
            designation: { select: { position: true } },
          },
        },
      },
    })

    if (!requisicao) {
      return null
    }

    const itemNumbers = Array.from(
      new Set(requisicao.detalhes.map((d) => d.nr_item))
    )
    if (itemNumbers.length === 0) {
      return requisicao
    }

    const ataItems = await prisma.ataItem.findMany({
      where: {
        pregao: requisicao.nr_pregao,
        nrItem: { in: itemNumbers },
      },
      select: { nrItem: true, fornecedor: true },
    })
    const fornecedorByNrItem = new Map<string, string>()
    for (const item of ataItems) {
      if (!fornecedorByNrItem.has(item.nrItem)) {
        fornecedorByNrItem.set(item.nrItem, item.fornecedor)
      }
    }

    return {
      ...requisicao,
      detalhes: requisicao.detalhes.map((detalhe) => ({
        ...detalhe,
        fornecedor: fornecedorByNrItem.get(detalhe.nr_item) ?? null,
      })),
    }
  }

  async findByNotaCreditoIdSemDetalhes(notaCreditoId: string) {
    return prisma.requisicao.findMany({
      where: { notaCreditoId },
      orderBy: { createdAt: "desc" },
    })
  }
}