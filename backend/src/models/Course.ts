import { Schema, model, Document, Types } from "mongoose";

interface ICourse extends Document {
  title: string;
  description: string;
  chaptersId: Types.ObjectId;
  createdBy: string;
  createdAt: Date;
  checkpoint: number;
  state: string;
  isPublic?: boolean;
  quizId: string;
}

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  chaptersId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "GeminiData",
  },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  checkpoint: { type: Number, default: -1 },
  state: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  quizId: { type: String, required: true, default: "" },
});
const Course = model<ICourse>("Course", courseSchema);
export default Course;
