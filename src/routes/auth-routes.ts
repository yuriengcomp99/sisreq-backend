import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware.js"

import { makeUpdateUserController } from "../factories/auth/make-update-user-controller.js"
import { makeDeleteUserController } from "../factories/auth/make-delete-user-controller.js"
import { makeGetUserProfileController } from "../factories/auth/make-get-user-controller.js"

const router = Router()

const updateUserController = makeUpdateUserController()
const deleteUserController = makeDeleteUserController()
const getUserProfileController = makeGetUserProfileController()

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           example:
 *             name: Yuri Rodrigues
 *             email: yuri@email.com
 *             password: 123456
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch("/me", authMiddleware, (req, res) => {
  return updateUserController.handle(req, res)
})

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Delete authenticated user account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router.delete("/me", authMiddleware, (req, res) => {
  return deleteUserController.handle(req, res)
})

export default router