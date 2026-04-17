import { Router } from "express"

import { makeCreateDesignationController } from "../factories/setor/make-create-designation-controller.js"
import { makeGetDesignationsController } from "../factories/setor/make-get-designations-controller.js"
import { makeGetDesignationByIdController } from "../factories/setor/make-get-designation-by-id-controller.js"
import { makeUpdateDesignationController } from "../factories/setor/make-update-designation-controller.js"
import { makeDeleteDesignationController } from "../factories/setor/make-delete-designation-controller.js"
import { authMiddleware } from "../middlewares/auth-middleware.js"

const router = Router()

const createController = makeCreateDesignationController()
const getController = makeGetDesignationsController()
const getByIdController = makeGetDesignationByIdController()
const updateController = makeUpdateDesignationController()
const deleteController = makeDeleteDesignationController()

/**
 * @swagger
 * tags:
 *   name: Designation
 *   description: Gestão de setores/funções (cargos militares)
 */

/**
 * @swagger
 * /designation:
 *   post:
 *     tags: [Designation]
 *     summary: Criar setor
 *     description: Cadastra um novo setor/cargo para vincular usuários.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             position: "Fiscal Administrativo"
 *     responses:
 *       201:
 *         description: Setor criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Setor criado com sucesso"
 *               dados:
 *                 id: "0dc4b2f2-9e9b-4f35-b992-c72afc71d9f3"
 *                 position: "Fiscal Administrativo"
 *                 createdAt: "2026-04-15T10:00:00.000Z"
 *       400:
 *         description: Dados inválidos para criação do setor
 */
router.post("/", authMiddleware, (req, res) => createController.handle(req, res))

/**
 * @swagger
 * /designation:
 *   get:
 *     tags: [Designation]
 *     summary: Listar setores
 *     responses:
 *       200:
 *         description: Lista de setores cadastrados
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Operação realizada com sucesso"
 *               dados:
 *                 - id: "0dc4b2f2-9e9b-4f35-b992-c72afc71d9f3"
 *                   position: "Fiscal Administrativo"
 *                   createdAt: "2026-04-15T10:00:00.000Z"
 *                 - id: "e5bf0ec1-c4a4-4d83-b6c6-bc5e69df9fd7"
 *                   position: "Encarregado de Material"
 *                   createdAt: "2026-04-16T09:00:00.000Z"
 *       500:
 *         description: Erro ao buscar setores
 */
router.get("/", authMiddleware, (req, res) => getController.handle(req, res))

/**
 * @swagger
 * /designation/{id}:
 *   get:
 *     tags: [Designation]
 *     summary: Buscar setor por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "0dc4b2f2-9e9b-4f35-b992-c72afc71d9f3"
 *     responses:
 *       200:
 *         description: Setor encontrado
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Operação realizada com sucesso"
 *               dados:
 *                 id: "0dc4b2f2-9e9b-4f35-b992-c72afc71d9f3"
 *                 position: "Fiscal Administrativo"
 *                 createdAt: "2026-04-15T10:00:00.000Z"
 *                 users:
 *                   - id: "9a6f54e6-a553-4b2b-8f58-153a86d34fa0"
 *                     first_name: "João"
 *                     army_name: "SILVA"
 *                     graduation: "1º SGT"
 *                     email: "joao.silva@exemplo.mil.br"
 *                     om: "BCMS"
 *       404:
 *         description: Setor não encontrado
 */
router.get("/:id", authMiddleware, (req, res) => getByIdController.handle(req, res))

/**
 * @swagger
 * /designation/{id}:
 *   patch:
 *     tags: [Designation]
 *     summary: Atualizar setor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "0dc4b2f2-9e9b-4f35-b992-c72afc71d9f3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             position: "Chefe da Seção Administrativa"
 *     responses:
 *       200:
 *         description: Setor atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Setor atualizado com sucesso"
 *               dados:
 *                 id: "0dc4b2f2-9e9b-4f35-b992-c72afc71d9f3"
 *                 position: "Chefe da Seção Administrativa"
 *                 createdAt: "2026-04-15T10:00:00.000Z"
 *       400:
 *         description: Falha ao atualizar setor
 */
router.patch("/:id",authMiddleware, (req, res) => updateController.handle(req, res))

/**
 * @swagger
 * /designation/{id}:
 *   delete:
 *     tags: [Designation]
 *     summary: Deletar setor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "0dc4b2f2-9e9b-4f35-b992-c72afc71d9f3"
 *     responses:
 *       200:
 *         description: Setor removido com sucesso
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Setor removido com sucesso"
 *               dados: null
 *       400:
 *         description: Falha ao remover setor
 */
router.delete("/:id",authMiddleware, (req, res) => deleteController.handle(req, res))

export { router as DesignationRouter }