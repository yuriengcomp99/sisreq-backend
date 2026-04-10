import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware.js"

import { makeLoginController } from "../factories/auth/make-login.js"
import { makeRegisterController } from "../factories/auth/make-register.js"

import { makeUpdateUserController } from "../factories/auth/make-update-user-controller.js"
import { makeDeleteUserController } from "../factories/auth/make-delete-user-controller.js"
import { makeGetUserProfileController } from "../factories/auth/make-get-user-controller.js"

const router = Router()

const loginController = makeLoginController()
const registerController = makeRegisterController()

const updateUserController = makeUpdateUserController()
const deleteUserController = makeDeleteUserController()
const getUserProfileController = makeGetUserProfileController()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: admin@email.com
 *             password: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post("/login", (req, res) => {
  return loginController.handle(req, res)
})

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Yuri Rodrigues
 *             email: yuri@email.com
 *             password: 123456
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post("/register", (req, res) => {
  return registerController.handle(req, res)
})

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get("/me", authMiddleware, (req, res) => {
  return getUserProfileController.handle(req, res)
})

/**
 * @swagger
 * /auth/me:
 *   patch:
 *     summary: Update authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/me", authMiddleware, (req, res) => {
  return updateUserController.handle(req, res)
})

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Delete authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/me", authMiddleware, (req, res) => {
  return deleteUserController.handle(req, res)
})

export default router