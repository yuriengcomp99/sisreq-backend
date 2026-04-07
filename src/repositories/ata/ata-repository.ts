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
        fornecedor: "asc",
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

    const fornecedoresMap = new Map()

    for (const item of data) {
      if (!fornecedoresMap.has(item.fornecedor)) {
        fornecedoresMap.set(item.fornecedor, {
          fornecedor: item.fornecedor,
          atas: new Map(),
        })
      }

      const fornecedor = fornecedoresMap.get(item.fornecedor)

      if (!fornecedor.atas.has(item.nrAta)) {
        fornecedor.atas.set(item.nrAta, {
          nrAta: item.nrAta,
          itens: [],
        })
      }

      const ata = fornecedor.atas.get(item.nrAta)

      ata.itens.push({
        nrItem: item.nrItem,
        descricao: item.descricao,
        valorUnitario: item.valorUnitario,
        qtdSaldo: item.qtdSaldo,
        qtdHomologada: item.qtdHomologada,
        qtdAutorizada: item.qtdAutorizada,
      })
    }

    const fornecedores = Array.from(fornecedoresMap.values()).map(f => ({
      fornecedor: f.fornecedor,
      atas: Array.from(f.atas.values()),
    }))

    return {
      ...base,
      fornecedores,
    }
  }

}