import GeminiData from "../models/GeminiData";
import Course from "../models/Course";

export const saveGeminiResponse = async (
  geminiResponse: { chapters: any[] },
  coursePayload: {
    title: string;
    description: string;
    createdBy: string;
    state: string;
    checkpoints?: string[];
    isPublic?: boolean;
  }
) => {
  // Save the chapters array to GeminiData collection
  const geminiDoc = await GeminiData.create({
    chapters: geminiResponse.chapters,
  });

  // Create a new course referencing the GeminiData record
  const course = await Course.create({
    title: coursePayload.title,
    description: coursePayload.description,
    chaptersId: [String(geminiDoc._id)], // changed: convert unknown _id to string
    createdBy: coursePayload.createdBy,
    state: coursePayload.state,
    checkpoints: coursePayload.checkpoints || [],
    isPublic: coursePayload.isPublic || false,
  });

  return { geminiDoc, course };
};
