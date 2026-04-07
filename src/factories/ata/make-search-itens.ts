import { AtaRepository } from "../../repositories/ata/ata-repository.js"
import { SearchItensUseCase } from "../../use-cases/ata/search-itens-usecase.js"
import { SearchItensController } from "../../controllers/ata/search-itens-controller.js"

export function makeSearchItensController() {
  const repository = new AtaRepository()

  const useCase = new SearchItensUseCase(repository)
  
  const controller = new SearchItensController(useCase)

  return controller
}