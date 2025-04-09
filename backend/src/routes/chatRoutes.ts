import { Router } from "express";
import chatController from "../controllers/chatController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /chat/ask:
 *   post:
 *     summary: Send a message to the AI assistant with lesson context
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's question
 *               context:
 *                 type: object
 *                 description: Current lesson context
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post("/ask", verifyToken, chatController.askQuestion);

export default router;
