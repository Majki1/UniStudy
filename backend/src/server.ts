import express from "express";
import cors from "cors";
import multer from "multer";
import pdfController from "./controllers/pdfController";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Apply middleware
app.use(cors());

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define route with the controller handling the upload
app.post("/upload", upload.array("pdfs"), pdfController.upload);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
