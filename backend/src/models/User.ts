import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Make password optional for Google-authenticated users by setting required false with a default empty string.
  password: { type: String, required: false, default: "" },
});

export default model<IUser>("User", userSchema);
