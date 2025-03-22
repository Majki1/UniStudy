import { Router } from "express";
import userAuthController from "../controllers/userAuthController";

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Bad Request.
 */
router.post("/signup", userAuthController.signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Server error.
 */
router.post("/login", userAuthController.logIn);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authenticate user with Google.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful.
 *       401:
 *         description: Invalid token.
 *       500:
 *         description: Server error.
 */
router.post("/google", userAuthController.googleAuth);

export default router;
