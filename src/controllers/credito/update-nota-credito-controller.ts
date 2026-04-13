export class UpdateNotaCreditoController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const nota = await this.useCase.execute(req.params.id, req.body)
      return res.json(nota)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}