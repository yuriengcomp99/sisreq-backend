import { Request, Response } from "express"

export class RequisicaoController {
  constructor(private createUseCase: any) {}

  async create(req: Request, res: Response) {
    try {
      const result = await this.createUseCase.execute(req.body)

      return res.status(201).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        error: "Erro ao criar requisição"
      })
    }
  }
}