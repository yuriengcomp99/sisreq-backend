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

/**
 * @swagger
 * /pregoes/import:
 *   post:
 *     summary: Importa planilha de pregões - compilado de dados (ata)
 *     tags: [Pregoes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Arquivo importado com sucesso
 */
ataRoutes.post(
  "/import",
  upload.single("file"),
  (req, res) => controller.handle(req, res)
)

/**
 * @swagger
 * /pregoes:
 *   get:
 *     summary: Lista todos os pregões disponíveis que temos capaidade de empenho (Gerenciador, Participante, Adesão)
 *     tags: [Pregoes]
 *     responses:
 *       200:
 *         description: Lista de pregões
 */
ataRoutes.get("/", (req, res) =>
  getPregoesController.handle(req, res)
)

/**
 * @swagger
 * /pregoes/{pregao}/{ugg}:
 *   get:
 *     summary: Retorna detalhes de um pregão específico e items
 *     tags: [Pregoes]
 *     parameters:
 *       - in: path
 *         name: pregao
 *         required: true
 *         schema:
 *           type: string
 *           example: "12/2026"
 *       - in: path
 *         name: ugg
 *         required: true
 *         schema:
 *           type: string
 *           example: "160000"
 *     responses:
 *       200:
 *         description: Dados do pregão
 */
ataRoutes.get("/:pregao/:ugg", (req, res) => {
  return getPregaoController.handle(req, res)
})

/**
 * @swagger
 * /pregoes/{pregao}/{ugg}/itens:
 *   get:
 *     summary: Lista itens de um pregão (com busca opcional)
 *     tags: [Pregoes]
 *     parameters:
 *       - in: path
 *         name: pregao
 *         required: true
 *         schema:
 *           type: string
 *         description: Número do pregão
 *       - in: path
 *         name: ugg
 *         required: true
 *         schema:
 *           type: string
 *         description: Código da UGG
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Texto para busca na descrição do item
 *         example: "2629"
 *     responses:
 *       200:
 *         description: Lista de itens do pregão
 *         content:
 *           application/json:
 *             example:
 *               - nrItem: "1"
 *                 descricao: "Material hospitalar"
 *                 qtdSaldo: 10
 *                 valorUnitario: 100
 */
ataRoutes.get("/:pregao/:ugg/itens", (req, res) => {
  return searchItensController.handle(req, res)
})

export { ataRoutes }