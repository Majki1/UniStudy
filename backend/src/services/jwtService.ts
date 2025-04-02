import jwt from "jsonwebtoken";

export const getEmailFromToken = (token: string): string | null => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT secret not configured");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email?: string };
    return decoded.email || null;
  } catch (error) {
    return null;
  }
};
