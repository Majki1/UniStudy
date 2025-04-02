import { Request, Response, NextFunction } from "express";
import { getRecentCourses } from "../services/courseService";
import Course from "../models/Course";

export const fetchRecentCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const courses = await getRecentCourses();
    res.json({ success: true, data: courses });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

// New update course controller
export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const fieldsToUpdate = req.body;
    // Only allow updates to these fields
    const allowedFields = [
      "title",
      "description",
      "state",
      "isPublic",
      "checkpoint",
    ];
    const updateData: any = {};
    Object.keys(fieldsToUpdate).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = fieldsToUpdate[key];
      }
    });
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "No valid fields provided for update." });
      return;
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!updatedCourse) {
      res.status(404).json({ error: "Course not found." });
      return;
    }
    res.json({ success: true, data: updatedCourse });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      res.status(404).json({ error: "Course not found." });
      return;
    }
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const getCourseChapters = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate("chaptersId");
    if (!course) {
      res.status(404).json({ error: "Course not found." });
      return;
    }
    // Cast the populated chaptersId to an object with a 'chapters' property
    const geminiData = course.chaptersId as { chapters?: any[] };
    if (!geminiData || !geminiData.chapters) {
      res.status(404).json({ error: "Chapters not found for this course." });
      return;
    }
    res.json({ success: true, chapters: geminiData.chapters });
  } catch (error) {
    next(error);
  }
};
