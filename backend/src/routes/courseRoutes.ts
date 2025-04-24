import { Router } from "express";
import {
  fetchRecentCourses,
  updateCourse,
  getCourseChapters,
  getCourseById,
  getAllUserCourses,
  deleteCourse, // Add this import
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

/**
 * @swagger
 * /courses/all:
 *   get:
 *     summary: Retrieve all courses for the authenticated user
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all user's courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized access.
 */
router.get("/all", verifyToken, getAllUserCourses);

// Place /:id/chapters route first to avoid conflict with /:id
router.get("/:id/chapters", verifyToken, getCourseChapters);

// New endpoint to get a course by its id
router.get("/:id", verifyToken, getCourseById);

// Existing update route remains
router.put("/:id", verifyToken, updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course and its related data
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course and related data successfully deleted
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", verifyToken, deleteCourse);

export default router;
