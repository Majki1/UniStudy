import bcrypt from "bcrypt";
import User from "../models/User";

export async function signup(
  fullName: string,
  email: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ fullName, email, password: hashedPassword });
  return user.save();
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
}
