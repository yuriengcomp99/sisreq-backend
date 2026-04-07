import { AtaRepository } from "../../repositories/ata/ata-repository.js"

export class GetPregaoByUggUseCase {
  constructor(private ataRepository: AtaRepository) {}

  async execute(pregao: string, ugg: string) {
    const result = await this.ataRepository.getPregaoByNumeroEUgg(pregao, ugg)

    if (!result) {
      throw new Error("Pregão não encontrado")
    }

    return result
  }
}