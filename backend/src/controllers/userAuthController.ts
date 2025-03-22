import { RequestHandler } from "express";
import jwt from "jsonwebtoken"; // added import
import {
  signup as signupService,
  login as loginService,
  googleLogin,
} from "../services/userAuthService";

export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    await signupService(fullName, email, password);
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    next(error);
  }
};

export const logIn: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginService(email, password);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }
    // Ensure secret keys are provided
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets not configured");
    }
    // Sign tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const googleAuth: RequestHandler = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      res.status(400).json({ error: "idToken is required" });
      return;
    }
    const user = await googleLogin(idToken);
    // Ensure secret keys are provided
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets not configured");
    }
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export default {
  signUp,
  logIn,
  googleAuth,
};
