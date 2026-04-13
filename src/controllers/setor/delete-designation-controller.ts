export class DeleteDesignationController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      await this.useCase.execute(req.params.id)
      return res.status(204).send()
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}