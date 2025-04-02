import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../utils/cookies";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function useRecentCourses() {
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token) return;
    const fetchRecentCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/courses/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentCourses(response.data.data);
      } catch (err) {
        setError("Error fetching recent courses");
      } finally {
        setLoading(false);
      }
    };
    fetchRecentCourses();
  }, []);

  return { recentCourses, error, loading };
}
