import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { images } from "../constants/images";
import { getCookie } from "../utils/cookies";
import { useUserCourses } from "../hooks/useUserCourses";

const MyCourses = () => {
  const navigate = useNavigate();
  const { courses, loading, error } = useUserCourses();
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editedTitles, setEditedTitles] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (courses) {
      const titles: { [key: string]: string } = {};
      courses.forEach((course) => {
        titles[course._id] = course.title;
      });
      setEditedTitles(titles);
    }
  }, [courses]);

  const handleEdit = (courseId: string) => {
    setEditingCourseId(courseId);
  };

  const handleSave = async (courseId: string) => {
    try {
      const token = getCookie("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/courses/${courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: editedTitles[courseId] }),
        }
      );

      if (response.ok) {
        setEditingCourseId(null);
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <img
        src={images.rays}
        alt="Background rays"
        className="absolute z-0 w-full h-full min-h-screen object-cover opacity-30"
      />
      <div className="flex flex-col items-start p-4 z-10 relative">
        <NavBar authenticated={true} />

        <div className="w-full px-8 mt-8">
          <h1 className="text-3xl font-bold text-primary-text-color mb-6">
            My{" "}
            <span className="bg-gradient-to-b from-gradient-start to-gradient-end bg-clip-text text-transparent">
              Courses
            </span>
          </h1>

          {loading ? (
            <div className="w-full flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-t-2 border-gradient-start rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : courses.length === 0 ? (
            <div className="bg-alt-bg-color rounded-lg p-8 text-center">
              <h3 className="text-xl text-secondary-text-color mb-4">
                You don't have any courses yet
              </h3>
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 bg-gradient-to-b from-gradient-start to-gradient-end text-primary text-sm font-semibold rounded hover:cursor-pointer"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-alt-bg-color rounded-lg p-8 hover:shadow-lg transition-shadow relative"
                >
                  {/* State pill positioned in top right */}
                  {(course.state === "completed" ||
                    course.state === "in progress") && (
                    <div
                      className={`absolute top-3 right-3 rounded-full ${
                        course.state === "in progress"
                          ? "bg-gradient-to-b from-gradient-start to-gradient-end"
                          : course.state === "completed"
                          ? "bg-success"
                          : "bg-transparent"
                      } py-1 text-xs px-4 text-center text-primary font-medium`}
                    >
                      {course.state.charAt(0).toUpperCase() +
                        course.state.slice(1)}
                    </div>
                  )}

                  {/* Course title and edit button */}
                  <div className="flex items-center mt-4 mb-6">
                    {editingCourseId === course._id ? (
                      <>
                        <input
                          type="text"
                          value={editedTitles[course._id] || ""}
                          onChange={(e) =>
                            setEditedTitles({
                              ...editedTitles,
                              [course._id]: e.target.value,
                            })
                          }
                          className="text-xl text-primary-text-color font-bold border border-secondary-text-color p-1 rounded flex-grow mr-2"
                        />
                        <button
                          onClick={() => handleSave(course._id)}
                          className="text-secondary-text-color font-medium text-sm border-b border-secondary-text-color hover:cursor-pointer"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <h3
                          className="text-xl text-primary-text-color font-bold flex-grow mr-2 truncate hover:cursor-pointer"
                          onClick={() => navigate(`/topics/${course._id}`)}
                        >
                          {editedTitles[course._id] || course.title}
                        </h3>
                        <button
                          onClick={() => handleEdit(course._id)}
                          className="text-secondary-text-color font-medium text-sm border-b border-secondary-text-color hover:cursor-pointer"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>

                  <p className="text-secondary-text-color text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center mt-8">
                    <span className="text-xs text-secondary-text-color">
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => navigate(`/topics/${course._id}`)}
                      className="px-4 py-2 bg-gradient-to-b from-gradient-start to-gradient-end text-primary text-xs font-semibold rounded hover:cursor-pointer"
                    >
                      Open Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
