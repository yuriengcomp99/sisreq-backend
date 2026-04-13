export class GetDesignationsUseCase {
  constructor(private repository: any) {}

  async execute() {
    return this.repository.findAll()
  }
}