export class GetNotasCreditoUseCase {
  constructor(private repository: any) {}

  async execute() {
    return this.repository.findAll()
  }
}