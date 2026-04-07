export class CreateRequisicaoUseCase {
  constructor(private repository: any) {}

  async execute(data: any) {

    const detalhes = data.detalhes.map((item: any) => ({
      ...item,
      valor_total: item.qtd * item.valor_unitario
    }))

    return this.repository.create({
      ...data,
      data_req: new Date(data.data_req),
      detalhes
    })
  }
}