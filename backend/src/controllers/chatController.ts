import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const askQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, context } = req.body;

    if (!message || !context) {
      res.status(400).json({ error: "Message and context are required" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Format the context for the prompt
    const lessonContext = `
      Lesson Title: ${context.lessonTitle}
      Lesson Summary: ${context.lessonSummary}
      Key Points: ${context.keyPoints
        .map((point: any) => `- ${point.point}: ${point.explanation || ""}`)
        .join("\n")}
    `;

    const prompt = `
      You are an educational AI assistant helping a student understand their course material.
      
      The student is currently studying the following lesson:
      
      ${lessonContext}
      
      Based on this context, please answer the student's question:
      
      ${message}
      
      Format your response using Markdown:
      - Use **bold text** for important terms or concepts
      - Use \`inline code\` for technical terms or short code snippets
      - Use code blocks with triple backticks for longer code examples
      
      Provide a clear, concise, and helpful response. If you don't know the answer based on the given context,
      say so and suggest where they might find more information. Use examples when appropriate to illustrate concepts.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({ error: "Failed to process your question" });
  }
};

export default { askQuestion };
