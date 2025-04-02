import { Router } from "express";
import multer from "multer";
import pdfController from "../controllers/pdfController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload PDF files and extract chapters.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: pdfs
 *         type: file
 *         description: The PDF files to upload.
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully processed PDF files.
 *       400:
 *         description: No PDF files were uploaded.
 *       500:
 *         description: An error occurred while processing the PDFs.
 */
router.post("/upload", verifyToken, upload.array("pdfs"), pdfController.upload);

export default router;
