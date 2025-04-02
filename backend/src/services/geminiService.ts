import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper function to extract and combine JSON blocks from the raw response text
const cleanGeminiResponse = (rawText: string): any => {
  // Regular expression to match JSON blocks marked with triple backticks and "json"
  const regex = /```json\s*([\s\S]*?)\s*```/g;
  let combinedChapters: any[] = [];
  let match;

  while ((match = regex.exec(rawText)) !== null) {
    try {
      // Parse the JSON content inside the code block
      const jsonBlock = JSON.parse(match[1]);
      if (jsonBlock.chapters && Array.isArray(jsonBlock.chapters)) {
        combinedChapters = combinedChapters.concat(jsonBlock.chapters);
      }
    } catch (error) {
      console.error("Failed to parse JSON block:", error);
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

export default { processTextWithGemini };
