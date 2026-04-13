export class DeleteDesignationUseCase {
  constructor(private repository: any) {}

  async execute(id: string) {
    return this.repository.delete(id)
  }
}