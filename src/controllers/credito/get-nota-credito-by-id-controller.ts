export class GetNotaCreditoByIdController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const nota = await this.useCase.execute(req.params.id)
      return res.json(nota)
    } catch (err: any) {
      return res.status(404).json({ error: err.message })
    }
  }
}