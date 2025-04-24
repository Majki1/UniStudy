import { GoogleGenerativeAI } from "@google/generative-ai";
import { Types } from "mongoose";
import GeminiData from "../models/GeminiData";
import Quiz from "../models/Quiz";

// Helper function to extract and combine JSON blocks from the raw response text
const cleanGeminiResponse = (rawText: string): any => {
  // Try to extract JSON blocks marked with triple backticks
  const regex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  let combinedChapters: any[] = [];
  let match;

  // Pre-process the raw text to handle potential issues
  const sanitizeJson = (jsonStr: string): string => {
    return jsonStr
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\\(?!["\\/bfnrtu])/g, "\\\\") // Escape lone backslashes
      .replace(/(?<!\\)"/g, '\\"') // Escape unescaped quotes
      .replace(/```/g, "") // Remove any remaining backticks
      .replace(/\\"/g, '"') // Fix double-escaped quotes
      .trim();
  };

  while ((match = regex.exec(rawText)) !== null) {
    try {
      // Extract the content inside the code block
      let jsonContent = match[1].trim();

      // Try parsing the JSON as-is first
      try {
        const jsonBlock = JSON.parse(jsonContent);
        // Check for expected keys
        if (jsonBlock.chapters && Array.isArray(jsonBlock.chapters)) {
          combinedChapters = combinedChapters.concat(jsonBlock.chapters);
        } else if (jsonBlock.quiz && Array.isArray(jsonBlock.quiz)) {
          combinedChapters = combinedChapters.concat(jsonBlock.quiz);
        }
      } catch (error) {
        // If parsing fails, try to fix common JSON issues and try again
        console.warn("Initial JSON parse failed, attempting to sanitize...");

        // If the content doesn't start with '{', wrap it
        if (!jsonContent.trim().startsWith("{")) {
          jsonContent = `{ "chapters": ${jsonContent} }`;
        }

        try {
          const jsonBlock = JSON.parse(jsonContent);
          if (jsonBlock.chapters && Array.isArray(jsonBlock.chapters)) {
            combinedChapters = combinedChapters.concat(jsonBlock.chapters);
          } else if (jsonBlock.quiz && Array.isArray(jsonBlock.quiz)) {
            combinedChapters = combinedChapters.concat(jsonBlock.quiz);
          } else if (Array.isArray(jsonBlock)) {
            // Handle case where the JSON is just an array
            combinedChapters = combinedChapters.concat(jsonBlock);
          }
        } catch (innerError) {
          console.error(
            "Failed to parse JSON block even after sanitizing:",
            innerError
          );
        }
      }
    } catch (error) {
      console.error("Error processing JSON block:", error);
    }
  }

  // Fallback: attempt to parse the entire rawText as JSON
  if (combinedChapters.length === 0) {
    try {
      // Try different parsing strategies
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        // Try to find valid JSON anywhere in the text
        const jsonPattern = /\{[\s\S]*\}/;
        const jsonMatch = rawText.match(jsonPattern);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (innerError) {
            console.error(
              "Failed to extract valid JSON from response:",
              innerError
            );
          }
        }
      }

      if (parsed) {
        if (parsed.chapters && Array.isArray(parsed.chapters)) {
          combinedChapters = parsed.chapters;
        } else if (parsed.quiz && Array.isArray(parsed.quiz)) {
          combinedChapters = parsed.quiz;
        } else if (Array.isArray(parsed)) {
          combinedChapters = parsed;
        }
      }
    } catch (error) {
      console.error("All JSON parsing attempts failed:", error);
      // Last resort: Try to extract meaningful content even without proper JSON structure
      const chapterPattern = /title["\s:]+([^"]+)/g;
      let titleMatch;
      let emergencyChapters = [];

      while ((titleMatch = chapterPattern.exec(rawText)) !== null) {
        emergencyChapters.push({
          title: titleMatch[1],
          summary: "Content extraction failed. Please retry.",
          keyPoints: [],
        });
      }

      if (emergencyChapters.length > 0) {
        console.warn(
          "Using emergency content extraction. Found",
          emergencyChapters.length,
          "potential chapters"
        );
        combinedChapters = emergencyChapters;
      }
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
      
      Use Markdown formatting in your summaries and explanations:
      - Use **bold** for important terms or concepts
      - Use *italics* for emphasis
      - Use \`inline code\` for technical terms, methods, or properties
      - Use code blocks with triple backticks for code examples
      - Use bullet points and numbered lists where appropriate
      - Use headings (##, ###) to organize content within explanations
      - Make sure not to bold headings
      - Only use one markup style for each heading
      - Use emojis to make the text more engaging and fun
      
      Respond in the same language as the text provided.
      Keep the tone informal and friendly yet engaging.
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
