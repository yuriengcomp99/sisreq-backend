import { AtaRepository } from "../../repositories/ata/ata-repository.js"

export class SearchItensUseCase {
  constructor(private repository: AtaRepository) {}

  async execute(pregao: string, ugg: string, search?: string) {
    return this.repository.searchItensByPregaoEUgg(pregao, ugg, search)
  }
}