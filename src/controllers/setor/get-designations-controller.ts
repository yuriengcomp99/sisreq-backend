export class GetDesignationsController {
  constructor(private useCase: any) {}

  async handle(req: any, res: any) {
    const result = await this.useCase.execute()
    return res.json(result)
  }
}