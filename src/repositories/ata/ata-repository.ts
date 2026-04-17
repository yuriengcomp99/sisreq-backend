import { prisma } from "../../database/prisma.js"


interface AtaData {
  pregao: string
  objeto: string
  ugg: string
  nrAta: string
  nrItem: string
  descricao: string
  fornecedor: string
  inicioVigAta: Date
  fimVigAta: Date
  valorUnitario: number
  uasg: string
  tipoUasg: string
  qtdHomologada: number
  qtdAutorizada: number
  qtdSaldo: number
}

export class AtaRepository {
  async upsert(data: AtaData) {
    return prisma.ataItem.upsert({
      where: {
        pregao_ugg_nrAta_nrItem: {
          pregao: data.pregao,
          ugg: data.ugg,
          nrAta: data.nrAta,
          nrItem: data.nrItem,
        }
      },
      update: data,
      create: data,
    })
  }

  async getPregoesDetalhado() {

    const pregoes = await prisma.ataItem.findMany({
      distinct: ["pregao", "ugg"],
      select: {
        pregao: true,
        objeto: true,
        ugg: true,
        tipoUasg: true,
        inicioVigAta: true,
        fimVigAta: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const counts = await prisma.ataItem.groupBy({
      by: ["pregao", "ugg"],
      _count: {
        _all: true,
      },
      where: {
        qtdSaldo: {
          gt: 0,
        },
      },
    })

    const result = pregoes.map((p) => {
      const count = counts.find(c => 
        c.pregao === p.pregao && c.ugg === p.ugg
      )

      return {
        ...p,
        qtdItensDisponiveis: count?._count._all || 0,
      }
    })

    return result
  }

  async getPregaoByNumeroEUgg(pregao: string, ugg: string) {
    const data = await prisma.ataItem.findMany({
      where: {
        pregao,
        ugg,
      },
      orderBy: {
        descricao: "asc",
      },
    })

    if (data.length === 0) return null

    const base = {
      pregao: data[0].pregao,
      ugg: data[0].ugg,
      objeto: data[0].objeto,
      inicioVigAta: data[0].inicioVigAta,
      fimVigAta: data[0].fimVigAta,
    }

    const itens = data.map(item => ({
      nrItem: item.nrItem,
      descricao: item.descricao,
      valorUnitario: item.valorUnitario,
      qtdSaldo: item.qtdSaldo,
      qtdHomologada: item.qtdHomologada,
      qtdAutorizada: item.qtdAutorizada,
      fornecedor: item.fornecedor,
      nrAta: item.nrAta,
    }))

    return {
      ...base,
      itens,
    }
  }

  async searchItensByPregaoEUgg(
    pregao: string,
    ugg: string,
    search?: string
  ) {
    return prisma.ataItem.findMany({
      where: {
        pregao,
        ugg,
        ...(search && {
          descricao: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      select: {
        nrItem: true,
        descricao: true,
        valorUnitario: true,
        qtdSaldo: true,
        qtdHomologada: true,
        qtdAutorizada: true,
        fornecedor: true,
        nrAta: true,
      },
      orderBy: {
        descricao: "asc",
      },
    })
  }

}