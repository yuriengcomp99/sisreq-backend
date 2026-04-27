import { Router } from "express"
import { makeCreateRequisicaoController } from "../factories/requisicao/make-create-requisicao.js"
import { makeGetRequisicoesController } from "../factories/requisicao/make-get-requisicoes.js"
import { makeDeleteRequisicaoController } from "../factories/requisicao/make-delete-requisicao.js"
import { makeUpdateRequisicaoController } from "../factories/requisicao/make-update-requisicao.js"
import { makeGetRequisicaoByIdController } from "../factories/requisicao/make-get-requisicao-by-id.js"
import { makeEmitRequisicaoDocumentsController } from "../factories/requisicao/make-emit-requisicao-documents.js"
import { authMiddleware } from "../middlewares/auth-middleware.js"

const ReqRouter = Router()

const createController = makeCreateRequisicaoController()
const getController = makeGetRequisicoesController()
const deleteController = makeDeleteRequisicaoController()
const updateController = makeUpdateRequisicaoController()
const getByIdController = makeGetRequisicaoByIdController()
const emitDocsController = makeEmitRequisicaoDocumentsController()

/**
 * @swagger
 * /requisicoes:
 *   post:
 *     summary: Cria uma nova requisição
 *     tags: [Requisicoes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             numero_diex: "123"
 *             nup: "456"
 *             de: "Almoxarifado"
 *             para: "Fiscal Administrativo"
 *             assunto: "Aquisição de materiais"
 *             tipo: "GERENCIADORA"
 *             ug: "160000"
 *             nome_da_ug: "Base X"
 *             descricao_necessidade: "Material diversos"
 *             notaCreditoId: "uuid-da-nota-credito" 
 *             itens:
 *               - nr_item: "1"
 *                 descricao: "Caneta azul"
 *                 subitem: "A"
 *                 und: "UN"
 *                 qtd: 10
 *                 valor_unitario: 5
 *                 valor_total: 50
 *     responses:
 *       201:
 *         description: Requisição criada com sucesso
 */
ReqRouter.post("/",authMiddleware, (req, res) => {
  return createController.create(req, res)
})

/**
 * @swagger
 * /requisicoes:
 *   get:
 *     summary: Lista todas as requisições
 *     description: Cada item inclui valorTotal (soma dos itens). Não retorna detalhes/itens — use GET /requisicoes/{id} para isso.
 *     tags: [Requisicoes]
 *     responses:
 *       200:
 *         description: Lista de requisições
 */
ReqRouter.get("/",authMiddleware, (req, res) => {
  return getController.handle(req, res)
})

/**
 * @swagger
 * /requisicoes/emitir/pdf/{id}:
 *   get:
 *     summary: Emitir requisição em PDF
 *     description: |
 *       Gera o PDF em memória e envia como download (`Content-Disposition: attachment`).
 *       O arquivo **não é armazenado** no servidor.
 *     tags: [Requisicoes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID da requisição
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Corpo binário do PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Requisição não encontrada
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao gerar o PDF
 */
ReqRouter.get("/emitir/pdf/:id", authMiddleware, (req, res) => {
  return emitDocsController.emitPdf(req, res)
})

/**
 * @swagger
 * /requisicoes/emitir/word/{id}:
 *   get:
 *     summary: Emitir requisição em Word (DOCX)
 *     description: |
 *       Gera o documento Word (.docx) em memória e envia como download.
 *       O arquivo **não é armazenado** no servidor.
 *     tags: [Requisicoes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID da requisição
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Corpo binário do DOCX
 *         content:
 *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Requisição não encontrada
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao gerar o documento
 */
ReqRouter.get("/emitir/word/:id", authMiddleware, (req, res) => {
  return emitDocsController.emitWord(req, res)
})

/**
 * @swagger
 * /requisicoes/{id}:
 *   get:
 *     summary: Buscar uma requisição por ID
 *     tags: [Requisicoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "uuid-da-requisicao"
 *     responses:
 *       200:
 *         description: Requisição encontrada
 *       404:
 *         description: Requisição não encontrada
 */
ReqRouter.get("/:id",authMiddleware, (req, res) => {
  return getByIdController.handle(req, res)
})

/**
 * @swagger
 * /requisicoes/{id}:
 *   patch:
 *     summary: Atualiza uma requisição e seus itens em lote
 *     tags: [Requisicoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "uuid-da-requisicao"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             assunto: "Aquisição atualizada"
 *             descricao_necessidade: "Nova necessidade"
 *             notaCreditoId: "uuid-da-nota-credito" 
 *             itens:
 *               - id: "uuid-item-1"
 *                 descricao: "Item atualizado"
 *                 qtd: 20
 *                 valor_unitario: 10
 *               - descricao: "Novo item"
 *                 subitem: "B"
 *                 und: "UN"
 *                 qtd: 5
 *                 valor_unitario: 100
 *                 valor_total: 500
 *     responses:
 *       200:
 *         description: Requisição atualizada com sucesso
 *       404:
 *         description: Requisição não encontrada
 */
ReqRouter.patch("/:id",authMiddleware, (req, res) => {
  return updateController.handle(req, res)
})

/**
 * @swagger
 * /requisicoes/{id}:
 *   delete:
 *     summary: Remove uma requisição
 *     tags: [Requisicoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "uuid-da-requisicao"
 *     responses:
 *       200:
 *         description: Requisição deletada com sucesso
 *       404:
 *         description: Requisição não encontrada
 */
ReqRouter.delete("/:id",authMiddleware, (req, res) => {
  return deleteController.handle(req, res)
})

export default ReqRouter