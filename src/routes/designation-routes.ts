import { Router } from "express"

import { makeCreateDesignationController } from "../factories/setor/make-create-designation-controller.js"
import { makeGetDesignationsController } from "../factories/setor/make-get-designations-controller.js"
import { makeGetDesignationByIdController } from "../factories/setor/make-get-designation-by-id-controller.js"
import { makeUpdateDesignationController } from "../factories/setor/make-update-designation-controller.js"
import { makeDeleteDesignationController } from "../factories/setor/make-delete-designation-controller.js"

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
 *   description: Gestão de funções (cargos militares)
 */

/**
 * @swagger
 * /designation:
 *   post:
 *     tags: [Designation]
 *     summary: Criar designation
 */
router.post("/", (req, res) => createController.handle(req, res))

/**
 * @swagger
 * /designation:
 *   get:
 *     tags: [Designation]
 *     summary: Listar designations
 */
router.get("/", (req, res) => getController.handle(req, res))

/**
 * @swagger
 * /designation/{id}:
 *   get:
 *     tags: [Designation]
 *     summary: Buscar designation por ID
 */
router.get("/:id", (req, res) => getByIdController.handle(req, res))

/**
 * @swagger
 * /designation/{id}:
 *   patch:
 *     tags: [Designation]
 *     summary: Atualizar designation
 */
router.patch("/:id", (req, res) => updateController.handle(req, res))

/**
 * @swagger
 * /designation/{id}:
 *   delete:
 *     tags: [Designation]
 *     summary: Deletar designation
 */
router.delete("/:id", (req, res) => deleteController.handle(req, res))

export { router as DesignationRouter }