export class CreateDesignationController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const result = await this.useCase.execute(req.body)
      return res.status(201).json(result)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}