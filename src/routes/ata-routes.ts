import { Router } from "express"
import multer from "multer"
import { makeImportAtaController } from "../factories/ata/make-import-ata.js"
import { makeGetPregoesController } from "../factories/ata/make-get-pregoes.js"
import { makeGetPregaoByUggController } from "../factories/ata/make-get-pregao-by-ugg.js"
import { makeSearchItensController } from "../factories/ata/make-search-itens.js"

const ataRoutes = Router()
const upload = multer({ dest: "uploads/" })
const controller = makeImportAtaController()
const getPregoesController = makeGetPregoesController()
const getPregaoController = makeGetPregaoByUggController()
const searchItensController = makeSearchItensController()

ataRoutes.post(
  "/import",
  upload.single("file"),
  (req, res) => controller.handle(req, res)
)

ataRoutes.get("/pregoes", (req, res) =>
  getPregoesController.handle(req, res)
)

ataRoutes.get("/pregoes/:pregao/:ugg", (req, res) => {
  return getPregaoController.handle(req, res)
})

ataRoutes.get("/pregoes/:pregao/:ugg/itens", (req, res) => {
  return searchItensController.handle(req, res)
})

export { ataRoutes }