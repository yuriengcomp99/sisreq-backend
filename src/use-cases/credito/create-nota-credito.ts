export class CreateNotaCreditoUseCase {
  constructor(private repository: any) {}

  async execute(data: any) {
    return this.repository.create(data)
  }
}