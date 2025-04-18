import { Router } from "express";
import {
  fetchRecentCourses,
  updateCourse,
  getCourseChapters,
  getCourseById, // import the new function
} from "../controllers/courseController";
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

// Place /:id/chapters route first to avoid conflict with /:id
router.get("/:id/chapters", verifyToken, getCourseChapters);

// New endpoint to get a course by its id
router.get("/:id", verifyToken, getCourseById);

// Existing update route remains
router.put("/:id", verifyToken, updateCourse);

export default router;
