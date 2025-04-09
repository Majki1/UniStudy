import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import pdfRoutes from "./routes/pdfRoutes";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import quizRoutes from "./routes/quizRoutes";
import chatRoutes from "./routes/chatRoutes"; // Add import for chat routes
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Apply middleware
app.use(cors());
app.use(express.json());

// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "UniStudy API",
      version: "1.0.0",
      description: "API documentation for UniStudy Backend",
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Use extracted routes
app.use("/", pdfRoutes);
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/quizzes", quizRoutes);
app.use("/chat", chatRoutes); // Add chat routes

// MongoDB connection and server start
const connectionString = process.env.MONGODB_CONNECTION_STRING;

if (!connectionString) {
  console.error("MongoDB connection string missing");
  process.exit(1);
}

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
