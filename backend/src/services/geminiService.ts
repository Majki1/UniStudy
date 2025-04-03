import { GoogleGenerativeAI } from "@google/generative-ai";
import { Types } from "mongoose";
import GeminiData from "../models/GeminiData";
import Quiz from "../models/Quiz";

// Helper function to extract and combine JSON blocks from the raw response text
const cleanGeminiResponse = (rawText: string): any => {
  // Try to extract JSON blocks marked with triple backticks
  const regex = /```json\s*([\s\S]*?)\s*```/g;
  let combinedChapters: any[] = [];
  let match;
  while ((match = regex.exec(rawText)) !== null) {
    try {
      const jsonBlock = JSON.parse(match[1]);
      // Check both 'chapters' and 'quiz' keys
      if (jsonBlock.chapters && Array.isArray(jsonBlock.chapters)) {
        combinedChapters = combinedChapters.concat(jsonBlock.chapters);
      } else if (jsonBlock.quiz && Array.isArray(jsonBlock.quiz)) {
        combinedChapters = combinedChapters.concat(jsonBlock.quiz);
      }
    } catch (error) {
      console.error("Failed to parse JSON block:", error);
    }
  }
  // Fallback: attempt to parse the entire rawText as JSON
  if (combinedChapters.length === 0) {
    try {
      const parsed = JSON.parse(rawText);
      if (parsed.chapters && Array.isArray(parsed.chapters)) {
        combinedChapters = parsed.chapters;
      } else if (parsed.quiz && Array.isArray(parsed.quiz)) {
        combinedChapters = parsed.quiz;
      }
    } catch (error) {
      console.error("Fallback JSON parse failed:", error);
    }
  }
  return { chapters: combinedChapters };
};

const processTextWithGemini = async (aggregatedText: string): Promise<any> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Please read the following text and divide it into chapters. 
      For each chapter, provide a chapter title, a brief summary, and key points, for each key point give an explanation and examples if there are any.
      Return the result as a JSON object.
      
      Text:
      ${aggregatedText}
    `;

    const result = await model.generateContent(prompt);

    if (result.response.candidates === undefined) {
      throw new Error("No candidates found in the response");
    }
    // Extract the raw text from the response (adjust if the structure changes)
    const rawText = result.response.candidates[0].content.parts[0].text;

    if (rawText === undefined) {
      throw new Error("No text found in the response");
    }
    // Clean the response by extracting and combining JSON code blocks
    const cleanedResponse = cleanGeminiResponse(rawText);
    return cleanedResponse;
  } catch (error: any) {
    console.error(
      "Error calling Gemini API:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Updated: Function to fetch Gemini data by id from the database
const fetchGeminiDataById = async (id: string): Promise<any> => {
  const geminiData = await GeminiData.findById(id);
  if (!geminiData) {
    throw new Error(`Gemini data not found for id: ${id}`);
  }
  return geminiData.toObject();
};

const fetchQuiz = async (quizId: string): Promise<any> => {
  // Convert quizId string into a MongoDB ObjectId
  const objectId = new Types.ObjectId(quizId);
  const geminiData = await Quiz.findById(objectId);
  if (!geminiData) {
    throw new Error(`Quiz not found for id: ${quizId}`);
  }
  return geminiData.toObject();
};

const generateQuiz = async (chaptersId: string): Promise<any> => {
  try {
    const chaptersObject = await fetchGeminiDataById(chaptersId);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Please generate a quiz based on the following chapters. 
      For each chapter, provide a quiz question and 4 answers, one of which is correct, if it's a longer chapter you can make multiple questions.
      Return the result as a JSON object.

      Chapters:
      ${JSON.stringify(chaptersObject)}
    `;

    const result = await model.generateContent(prompt);

    if (result.response.candidates === undefined) {
      throw new Error("No candidates found in the response");
    }

    console.log("result", result.response.candidates[0].content.parts[0].text);
    // Extract the raw text from the response (adjust if the structure changes)
    const rawText = result.response.candidates[0].content.parts[0].text;

    if (rawText === undefined) {
      throw new Error("No text found in the response");
    }
    // Clean the response by extracting and combining JSON code blocks
    const cleanedResponse = cleanGeminiResponse(rawText);
    return cleanedResponse;
  } catch (error: any) {
    console.error(
      "Error calling Gemini API:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  processTextWithGemini,
  generateQuiz,
  fetchGeminiDataById,
  fetchQuiz,
};
