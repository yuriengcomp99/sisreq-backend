export class DeleteNotaCreditoUseCase {
  constructor(private repository: any) {}

  async execute(id: string) {
    return this.repository.delete(id)
  }
}