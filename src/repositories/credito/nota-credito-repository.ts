import { Prisma, UserRole } from "@prisma/client"
import { prisma } from "../../database/prisma.js"

export class NotaCreditoRepository {
  async create(data: Prisma.NotaCreditoUncheckedCreateInput) {
    return prisma.notaCredito.create({ data })
  }

  async findAllForUserScope(userId: string, role: UserRole) {
    const where: Prisma.NotaCreditoWhereInput | undefined =
      role === UserRole.ADMIN
        ? undefined
        : ({ userId } as Prisma.NotaCreditoWhereInput)
    return prisma.notaCredito.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })
  }

  async findByIdScoped(
    id: string,
    userId: string,
    role: UserRole
  ) {
    const where = {
      id,
      ...(role === UserRole.ADMIN ? {} : { userId }),
    } as Prisma.NotaCreditoWhereInput
    return prisma.notaCredito.findFirst({
      where,
      include: {
        requisicoes: {
          select: {
            id: true,
            numero_diex: true,
            nup: true,
            data_req: true,
            assunto: true,
          },
        },
      },
    })
  }

  /**
   * Por nota: quantidade de requisições vinculadas e soma dos valor_total dos itens (RequisicaoDetalhe).
   */
  async getRequisicaoUsageByNotaCreditoIds(notaIds: string[]) {
    if (notaIds.length === 0) {
      return [] as Array<{
        notaCreditoId: string
        requisicaoCount: number
        valorTotalRequisicoes: number
      }>
    }

    const rows = await prisma.$queryRaw<
      Array<{
        notaCreditoId: string
        requisicaoCount: number
        valorTotalRequisicoes: number
      }>
    >(Prisma.sql`
      SELECT nc.id AS "notaCreditoId",
             COALESCE(COUNT(DISTINCT r.id), 0)::int AS "requisicaoCount",
             COALESCE(SUM(rd."valor_total"), 0)::double precision AS "valorTotalRequisicoes"
      FROM "NotaCredito" nc
      LEFT JOIN "Requisicao" r ON r."notaCreditoId" = nc.id
      LEFT JOIN "RequisicaoDetalhe" rd ON rd."requisicaoId" = r.id
      WHERE nc.id IN (${Prisma.join(notaIds)})
      GROUP BY nc.id
    `)

    return rows
  }

  async update(
    id: string,
    data: Prisma.NotaCreditoUpdateInput
  ) {
    return prisma.notaCredito.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.notaCredito.delete({
      where: { id },
    })
  }
}
