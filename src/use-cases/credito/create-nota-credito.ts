import type { Prisma } from "@prisma/client"
import type { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"

export class CreateNotaCreditoUseCase {
  constructor(private repository: NotaCreditoRepository) {}

  async execute(
    body: Omit<Prisma.NotaCreditoUncheckedCreateInput, "userId">,
    userId: string
  ) {
    return this.repository.create({
      ...body,
      userId,
    } as Prisma.NotaCreditoUncheckedCreateInput)
  }
}
