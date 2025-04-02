import Course from "../models/Course";

// ...existing code if any...
export const getRecentCourses = async () => {
  // Fetch courses sorted by createdAt descending and limit to 3
  return Course.find().sort({ createdAt: -1 }).limit(3);
};
