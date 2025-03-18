import { Request, Response } from "express";
import pdfService from "../services/pdfService";
import geminiService from "../services/geminiService";
import { UploadResult } from "../models/UploadResult";

const CHUNK_SIZE = 3000; // Maximum characters per chunk (adjust as needed)
const DELAY_MS = 1000; // Delay in milliseconds between API calls

// Helper: Split text into chunks of defined size
const splitTextIntoChunks = (
  text: string,
  maxChunkLength: number
): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxChunkLength) {
    chunks.push(text.substring(i, i + maxChunkLength));
  }
  return chunks;
};

const upload = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      res.status(400).json({ error: "No PDF files were uploaded." });
      return;
    }

    const files = req.files as Express.Multer.File[];
    const results: UploadResult[] = [];

    for (const file of files) {
      // Parse the PDF to extract the entire text
      const text = await pdfService.parsePdf(file.buffer);

      // Split the text into manageable chunks
      const chunks = splitTextIntoChunks(text, CHUNK_SIZE);
      const combinedChapters: any[] = [];

      // Process each chunk sequentially with a delay between calls
      for (let i = 0; i < chunks.length; i++) {
        const geminiResponse = await geminiService.processTextWithGemini(
          chunks[i]
        );
        if (geminiResponse && geminiResponse.chapters) {
          // Append all chapters from this chunk
          combinedChapters.push(...geminiResponse.chapters);
        } else {
          console.error("No chapters found for chunk index", i);
        }
        // Add a delay before processing the next chunk (if not the last one)
        if (i < chunks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
        }
      }

      // Combine the results for the current file
      results.push({
        fileName: file.originalname,
        chapters: combinedChapters,
      });
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error processing PDF files:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the PDFs." });
  }
};

export default { upload };
