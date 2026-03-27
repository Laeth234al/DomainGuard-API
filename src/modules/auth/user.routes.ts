import { Router } from "express";
import { login, register, me } from "./user.controller";
import { loginSchema, registerSchema } from "./user.validation";
import { validate } from "../../middleware/validate";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Authentication API
 */

/**
 * @swagger
 * /api/auth/register:
 *    post:
 *      summary: Register user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        201:
 *          description: register and return token and user deatils
 *        400:
 *          description: Validation Error or User already Exists
 */
router.post("/register", validate(registerSchema, "body"), register);

/**
 * @swagger
 * /api/auth/login:
 *    post:
 *      summary: Login user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        200:
 *          description: loged in and return token and user deatils
 *        400:
 *          description: Validation Error
 *        401:
 *          description: email not exists or password is wrong
 */
router.post("/login", validate(loginSchema, "body"), login);

/**
 * @swagger
 * /api/auth/me:
 *    get:
 *      summary: Get current user info
 *      tags: [Auth]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: User info returned
 *        401:
 *          description: Unauthorized
 */
router.get("/me", authMiddleware, me);

export default router;
