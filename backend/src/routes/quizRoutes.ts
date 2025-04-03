import { Router } from "express";
import quizController from "../controllers/quizController";

const router = Router();

/**
 * @swagger
 * /quizzes/generate:
 *   post:
 *     summary: Generate quiz based on course chapters.
 *     description: Generate quiz questions and answers from the provided GeminiData document by its chaptersId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chaptersId:
 *                 type: string
 *                 description: The ID of the GeminiData document containing chapters.
 *             required:
 *               - chaptersId
 *     responses:
 *       200:
 *         description: Quiz generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: No chaptersId provided.
 *       500:
 *         description: Internal server error.
 */
router.post("/generate", quizController.generateQuiz);

/**
 * @swagger
 * /quizzes/{quizId}:
 *   get:
 *     summary: Fetch quiz by ID.
 *     description: Retrieve quiz questions and answers for a specific quiz.
 *     parameters:
 *       - in: path
 *         name: quizId
 *         schema:
 *           type: string
 *         required: true
 *         description: The quiz ID.
 *     responses:
 *       200:
 *         description: Quiz fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing or invalid quizId.
 *       500:
 *         description: Internal server error.
 */
router.get("/:quizId", quizController.fetchQuiz);

export default router;
