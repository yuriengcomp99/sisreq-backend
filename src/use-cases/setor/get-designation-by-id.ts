export class GetDesignationByIdUseCase {
  constructor(private repository: any) {}

  async execute(id: string) {
    const designation = await this.repository.findById(id)

    if (!designation) {
      throw new Error("Designation não encontrada")
    }

    return designation
  }
}