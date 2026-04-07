import { AtaRepository } from "../../repositories/ata/ata-repository.js"

export class GetPregoesUseCase {
  constructor(private repository: AtaRepository) {}

  async execute() {
    return this.repository.getPregoesDetalhado()
  }
}