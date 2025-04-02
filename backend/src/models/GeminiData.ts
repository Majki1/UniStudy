import { Schema, model, Document } from "mongoose";

interface Chapter {
  title: string;
  summary: string;
  keyPoints: {
    point: string;
    explanation?: string;
    examples?: string[];
  }[];
}

interface IGeminiData extends Document {
  chapters: Chapter[];
}

// Added chapter sub-schema to correctly validate each Chapter object.
const chapterSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  keyPoints: [
    {
      point: { type: String, required: true },
      explanation: String,
      examples: [String],
    },
  ],
});

// Updated GeminiData schema to use the chapterSchema within an array.
const geminiDataSchema = new Schema<IGeminiData>({
  chapters: { type: [chapterSchema], required: true },
});

export default model<IGeminiData>("GeminiData", geminiDataSchema);
