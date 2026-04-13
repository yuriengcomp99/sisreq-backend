export class GetDesignationByIdController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    try {
      const result = await this.useCase.execute(req.params.id)
      return res.json(result)
    } catch (err: any) {
      return res.status(404).json({ error: err.message })
    }
  }
}