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
        pregao_nrAta_nrItem: {
          pregao: data.pregao,
          nrAta: data.nrAta,
          nrItem: data.nrItem,
        },
      },
      update: data,
      create: data,
    })
  }

  async getPregoes() {
    return prisma.ataItem.findMany({
      distinct: ["pregao"],
      select: {
        pregao: true,
      },
      orderBy: {
        pregao: "desc",
      },
    })
  }

  async getPregoesDetalhado() {

    const pregoes = await prisma.ataItem.findMany({
      distinct: ["pregao"],
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
      by: ["pregao"],
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
      const count = counts.find(c => c.pregao === p.pregao)

      return {
        ...p,
        qtdItensDisponiveis: count?._count._all || 0,
      }
    })

    return result
  }
}