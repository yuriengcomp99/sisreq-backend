export class GetNotaCreditoByIdUseCase {
  constructor(private repository: any) {}

  async execute(id: string) {
    const nota = await this.repository.findById(id)

    if (!nota) {
      throw new Error("Nota de crédito não encontrada")
    }

    return nota
  }
}