import { ImportAtaController } from "../../controllers/ata/import-ata-controller.js"
import { AtaRepository } from "../../repositories/ata/ata-repository.js"
import { ImportAtaUseCase } from "../../use-cases/ata/import-ata-usecase.js"

export function makeImportAtaController() {
  const ataRepository = new AtaRepository()

  const importAtaUseCase = new ImportAtaUseCase(ataRepository)

  const importAtaController = new ImportAtaController(importAtaUseCase)

  return importAtaController
}