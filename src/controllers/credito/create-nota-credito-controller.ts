export class CreateNotaCreditoController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const nota = await this.useCase.execute(req.body)
      return res.status(201).json(nota)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}