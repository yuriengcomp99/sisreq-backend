export class CreateDesignationUseCase {
  constructor(private repository: any) {}

  async execute(data: any) {
    return this.repository.create(data)
  }
}