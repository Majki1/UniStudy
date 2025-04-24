import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../utils/cookies";
import { Course } from "../types/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function useUserCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const token = getCookie("accessToken");
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/courses/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data.data);
      } catch (err) {
        setError("Failed to fetch courses");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
}
