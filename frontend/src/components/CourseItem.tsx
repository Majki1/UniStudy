import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "../constants/icons";
import { getCookie } from "../utils/cookies";

function CourseItem({
  courseId,
  courseName,
  state,
}: {
  courseId: string;
  courseName: string;
  state: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(courseName);
  const navigation = useNavigate();
  const handleClick = () => {
    navigation(`/topics/${courseId}`);
  };
  const handleSave = async () => {
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
          body: JSON.stringify({ title: newTitle }),
        }
      );
      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="flex flex-row items-center justify-vetween w-[90%] gap-x-2 p-4 border-b border-secondary-text-color mt-5">
      <img src={icons.tv} alt="Course Icon" className="size-8 mr-2" />
      {isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="text-xl text-primary-text-color font-bold border p-1 rounded"
        />
      ) : (
        <h3
          className={`text-xl ${
            state === "in progress"
              ? "text-gradient-start"
              : state === "completed"
              ? "text-success"
              : "text-primary-text-color"
          } font-bold hover:cursor-pointer hover:underline`}
          onClick={handleClick}
        >
          {newTitle}
        </h3>
      )}
      {(state === "completed" || state === "in progress") && (
        <div
          className={`w-auto rounded-full ${
            state === "in progress"
              ? "bg-gradient-to-r from-gradient-start to-gradient-end"
              : state === "completed"
              ? "bg-success"
              : "bg-transparent"
          } py-1 text-xs px-4 text-center text-primary font-medium`}
        >
          {state.charAt(0).toUpperCase() + state.slice(1)}
        </div>
      )}
      {isEditing ? (
        <button
          onClick={handleSave}
          className="text-secondary-text-color font-medium text-sm ml-auto border-b border-secondary-text-color hover:cursor-pointer"
        >
          Save
        </button>
      ) : (
        <a
          onClick={() => setIsEditing(true)}
          className="text-secondary-text-color font-medium text-sm ml-auto border-b border-secondary-text-color hover:cursor-pointer"
        >
          Edit
        </a>
      )}
    </div>
  );
}

export default CourseItem;
