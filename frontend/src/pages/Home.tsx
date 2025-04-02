import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { icons } from "../constants/icons";
import { images } from "../constants/images";
import CourseItem from "../components/CourseItem";
import { getCookie } from "../utils/cookies";
import { useFileUploader } from "../hooks/useFileUploader";
import { useRecentCourses } from "../hooks/useRecentCourses";

function HomeScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    recentCourses,
    loading: coursesLoading,
    error: coursesError,
  } = useRecentCourses();
  const {
    selectedFiles,
    uploading,
    error,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleUpload,
  } = useFileUploader();

  // Updated: handle upload and redirection with error handling
  const uploadAndRedirect = async () => {
    navigate("/loading");
    try {
      await handleUpload();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      navigate("/home");
    }
  };

  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <img
        src={images.rays}
        alt="Background rays"
        className="absolute z-0 w-full h-full min-h-screen object-cover opacity-30"
      />
      <div className="min-h-screen bg-primary flex flex-col items-start p-4">
        <NavBar authenticated={true} />
        <div className="flex flex-row items-center justify-between w-full mb-2 px-6 z-10 mt-8">
          <h1 className="text-3xl font-bold mb-4 text-primary-text-color">
            Hello{" "}
            <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
              User
            </span>
            , welcome back!
          </h1>
          <button
            onClick={() => navigate("/topics")}
            className="flex flex-row items-center justify-center font-medium bg-gradient-to-r from-gradient-start to-gradient-end text-primary py-2 px-8 rounded hover:bg-gradient-to-l transition-colors hover:cursor-pointer"
          >
            <img src={icons.play} alt="Play Icon" className="size-5 mr-1" />
            Continue where you left off
          </button>
        </div>
        <div className="flex flex-row items-start justify-between w-full mb-4 px-6 z-10">
          <div className="flex flex-col items-start justify-start w-1/2">
            <h2 className="text-xl font-medium text-secondary-text-color">
              Recent courses
            </h2>
            {coursesLoading ? (
              <p className="text-secondary-text-color">Loading courses...</p>
            ) : coursesError ? (
              <p className="text-red-500">{coursesError}</p>
            ) : recentCourses.length > 0 ? (
              recentCourses.map((course, index) => (
                <CourseItem
                  courseId={course._id}
                  key={index}
                  courseName={course.title}
                  state={course.state}
                />
              ))
            ) : (
              <p className="text-secondary-text-color">
                No recent courses found.
              </p>
            )}
          </div>
          <div className="flex flex-col items-start justify-center w-1/2">
            <h2 className="text-xl font-medium text-secondary-text-color mb-4">
              Upload your next PDF
            </h2>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full h-160 border-2 border-dashed border-secondary-text-color rounded-lg flex items-center justify-center cursor-pointer bg-transparent"
            >
              <input
                type="file"
                id="file-upload"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center text-secondary-text-color pointer-events-none">
                <img src={icons.upload} alt="Upload Icon" className="size-14" />
                <p className="mt-2">Upload PDF Here</p>
              </div>
            </div>
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="mt-2 text-secondary-text-color">
                {Array.from(selectedFiles).map((file, index) => (
                  <p key={index}>Selected: {file.name}</p>
                ))}
              </div>
            )}
            {selectedFiles && selectedFiles.length > 0 && (
              <button
                onClick={uploadAndRedirect}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-gradient-start to-gradient-end text-primary py-2 rounded hover:bg-gradient-to-l hover:cursor-pointer transition-colors"
              >
                {uploading ? "Uploading..." : "Upload PDF"}
              </button>
            )}
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeScreen;
