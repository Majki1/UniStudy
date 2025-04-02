import { Router } from "express";
import { fetchRecentCourses } from "../controllers/courseController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /courses/recent:
 *   get:
 *     summary: Retrieve recent courses
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of recent courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized access.
 */
router.get("/recent", verifyToken, fetchRecentCourses);

export default router;
