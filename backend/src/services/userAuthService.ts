import bcrypt from "bcrypt";
import User from "../models/User";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export async function googleLogin(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("Google token verification failed");
  }
  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = new User({
      fullName: payload.name || "",
      email: payload.email,
      password: "", // Google-authenticated accounts have no password
    });
    await user.save();
  }
  return user;
}
