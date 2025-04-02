import { Request, Response, NextFunction } from "express";
import { getRecentCourses } from "../services/courseService";

// ...existing code if any...
export const fetchRecentCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await getRecentCourses();
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};
