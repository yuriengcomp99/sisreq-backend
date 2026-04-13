export class GetNotasCreditoController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    const notas = await this.useCase.execute()
    return res.json(notas)
  }
}