import { prisma } from "../../database/prisma.js"
import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"

export class UpdateRequisicaoUseCase {
  constructor(private requisicaoRepository: RequisicaoRepository) {}

  async execute(id: string, data: any) {
    if (!id) {
      throw new Error("ID_REQUIRED")
    }

    const { itens, ...requisicaoData } = data

    const cleanRequisicaoData = Object.fromEntries(
      Object.entries(requisicaoData).filter(([_, v]) => v !== undefined)
    )

    return prisma.$transaction(async (tx) => {

      const exists = await tx.requisicao.findUnique({
        where: { id },
      })

      if (!exists) {
        throw new Error("REQUISICAO_NOT_FOUND")
      }

      if (Object.keys(cleanRequisicaoData).length > 0) {
        await tx.requisicao.update({
          where: { id },
          data: cleanRequisicaoData,
        })
      }

      if (Array.isArray(itens)) {

        const idsEnviados = itens
          .filter((i) => i.id)
          .map((i) => i.id)

        if (idsEnviados.length > 0) {
          await tx.requisicaoDetalhe.deleteMany({
            where: {
              requisicaoId: id,
              id: { notIn: idsEnviados },
            },
          })
        } else {
          await tx.requisicaoDetalhe.deleteMany({
            where: { requisicaoId: id },
          })
        }

        for (const item of itens) {
          if (item.id) {
            const { id: itemId, ...itemData } = item

            const cleanData = Object.fromEntries(
              Object.entries(itemData).filter(([_, v]) => v !== undefined)
            )

            const detalhe = await tx.requisicaoDetalhe.findFirst({
              where: { id: itemId, requisicaoId: id },
            })
            if (!detalhe) {
              throw new Error("REQUISICAO_DETALHE_NOT_FOUND")
            }

            await tx.requisicaoDetalhe.update({
              where: { id: itemId },
              data: cleanData,
            })
          } else {
            await tx.requisicaoDetalhe.create({
              data: {
                ...item,
                requisicaoId: id,
              },
            })
          }
        }
      }

      return data
    })
  }
}