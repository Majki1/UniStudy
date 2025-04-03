export async function fetchCourseDetails(
  id: string,
  token: string,
  API_URL: string
): Promise<any> {
  // Fetch course details
  try {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      return data.data;
    } else {
      console.error("Failed to fetch course details");
      return null;
    }
  } catch (error) {
    console.error("Error fetching course details:", error);
    return null;
  }
}

export async function fetchTopics(
  id: string,
  token: string,
  API_URL: string
): Promise<any[]> {
  // Fetch topics for the course
  try {
    const response = await fetch(`${API_URL}/courses/${id}/chapters`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      return data.chapters;
    } else {
      console.error("Failed to fetch topics");
      return [];
    }
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}

export async function updateCourseCheckpoint(
  id: string,
  checkpoint: number | null,
  totalTopics: number,
  token: string,
  API_URL: string
): Promise<void> {
  const cp = checkpoint !== null ? checkpoint : -1;
  const newState =
    totalTopics > 0
      ? cp === totalTopics - 1
        ? "completed"
        : cp >= 0
        ? "in progress"
        : "new"
      : "new";
  try {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        checkpoint: cp,
        state: newState,
      }),
    });
    if (!response.ok) {
      console.error("Failed to update checkpoint");
    }
  } catch (error) {
    console.error("Error updating checkpoint", error);
  }
}
