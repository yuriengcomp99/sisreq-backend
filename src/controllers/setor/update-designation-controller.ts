export class UpdateDesignationController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const result = await this.useCase.execute(req.params.id, req.body)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}