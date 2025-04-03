import { Schema, model, Document } from "mongoose";

interface IQuiz extends Document {
  quizData: any;
  createdAt: Date;
}

const quizSchema = new Schema<IQuiz>({
  quizData: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IQuiz>("Quiz", quizSchema);
