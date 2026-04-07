import { Router } from "express"
import multer from "multer"
import { makeImportAtaController } from "../factories/ata/make-import-ata.js"
import { makeGetPregoesController } from "../factories/ata/make-get-pregoes.js"

const ataRoutes = Router()

const upload = multer({ dest: "uploads/" })

const controller = makeImportAtaController()

const getPregoesController = makeGetPregoesController()

ataRoutes.post(
  "/import",
  upload.single("file"),
  (req, res) => controller.handle(req, res)
)

ataRoutes.get("/pregoes", (req, res) =>
  getPregoesController.handle(req, res)
)

export { ataRoutes }