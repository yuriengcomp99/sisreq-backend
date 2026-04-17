import type { Prisma } from "@prisma/client"
import { UserRole } from "@prisma/client"
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
        requisicoes: true,
      },
    })
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
