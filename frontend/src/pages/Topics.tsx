import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "../constants/icons";
import { images } from "../constants/images";
import { getCookie } from "../utils/cookies";
import NavBar from "../components/NavBar";
import NavigationModal from "../components/NavigationModal";
import {
  fetchCourseDetails,
  fetchTopics,
  updateCourseCheckpoint,
} from "../utils/courseApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const TopicsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigation = useNavigate();
  const [topics, setTopics] = React.useState<any[]>([]);
  const [course, setCourse] = React.useState<any>(null);
  const [selectedTopic, setSelectedTopic] = React.useState<any>(topics[0]);
  const [loading, setLoading] = React.useState(true);
  const [lastCompletedIndex, setLastCompletedIndex] = React.useState<
    number | null
  >(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const token = getCookie("accessToken");

  const loadCourseDetails = useCallback(async () => {
    setLoading(true);
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const data = await fetchCourseDetails(id!, token, API_URL);
    if (data) setCourse(data);
    setLoading(false);
  }, [id, token]);

  const loadTopics = useCallback(async () => {
    setLoading(true);
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const chapters = await fetchTopics(id!, token, API_URL);
    setTopics(chapters);
    console.log("Fetched topics:", chapters);
    setLoading(false);
  }, [id, token]);

  useEffect(() => {
    if (!token) {
      navigation("/login");
      return;
    }
    loadCourseDetails();
    loadTopics();
  }, [id, token, loadCourseDetails, loadTopics]);

  useEffect(() => {
    if (course && topics.length > 0) {
      const chk = course.checkpoint;
      setLastCompletedIndex(chk !== undefined ? chk : null);
      const index = chk !== undefined && topics[chk] ? chk : 0;
      setSelectedTopic(topics[index]);
    }
  }, [course, topics]);

  const handleCompleteLesson = async () => {
    setLastCompletedIndex(currentTopicIndex);
    if (!token) {
      window.location.href = "/login";
      return;
    }
    await updateCourseCheckpoint(
      id!,
      currentTopicIndex,
      topics.length,
      token,
      API_URL
    );
    if (topics[currentTopicIndex + 1]) {
      setSelectedTopic(topics[currentTopicIndex + 1]);
    } else {
      setModalOpen(true);
    }
  };

  const handleGoToQuiz = async () => {
    if (!token) {
      navigation("/login");
      return;
    }
    if (id) {
      navigation(`/quiz/${id}`);
    } else {
      console.error("No quiz ID found for this course");
    }
  };

  const handleJumpToCheckpoint = () => {
    const nextLessonIndex =
      lastCompletedIndex !== null ? lastCompletedIndex + 1 : 0;
    if (topics[nextLessonIndex]) {
      setSelectedTopic(topics[nextLessonIndex]);
    }
  };

  const currentTopicIndex = selectedTopic
    ? topics.findIndex((t) => t._id === selectedTopic._id)
    : -1;
  const nextIndexExpected =
    lastCompletedIndex === null ? 0 : lastCompletedIndex + 1;

  return (
    <div className="flex flex-col w-full min-h-screen bg-primary">
      <NavBar authenticated={true} />
      <img
        src={images.rays}
        alt="Background"
        className="absolute top-0 z-0 left-0 w-full h-full object-cover opacity-30"
      />
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between w-full px-6 py-4 z-10">
            <div className="flex flex-col w-1/2 items-start justify-start mt-4">
              <h1 className="text-3xl font-bold text-primary-text-color">
                <span className="bg-gradient-to-b from-gradient-start to-gradient-end bg-clip-text text-transparent">
                  Users{" "}
                </span>
                {course?.title} course
              </h1>
              <p className="text-secondary-text-color text-sm mt-2">
                {course?.description}
              </p>
              {course && topics.length > 0 && (
                <p className="text-secondary-text-color text-sm mt-1">
                  Current Lesson:{" "}
                  {lastCompletedIndex !== null ? lastCompletedIndex + 1 : 0} of{" "}
                  {topics.length}
                </p>
              )}
              <div className="flex flex-row items-center mt-6">
                <button
                  onClick={handleJumpToCheckpoint}
                  className="px-4 py-2 bg-gradient-to-b from-gradient-start to-gradient-end text-primary text-xs font-semibold rounded hover:cursor-pointer"
                >
                  Jump to checkpoint
                </button>
                <button
                  onClick={handleGoToQuiz}
                  className="ml-4 px-4 py-2 bg-alt-bg-color text-secondary-text-color text-xs font-semibold rounded hover:cursor-pointer"
                >
                  Go to quiz
                </button>
              </div>
            </div>
            <div className="flex items-center justify-start w-1/2">
              <div className="flex items-start justify-center">
                <img src={images.wizardShocked} alt="Course Icon" />
                <div className="bg-alt-bg-color rounded-lg p-4">
                  <h3 className="text-sm text-primary-text-color">
                    Don’t forget you can ask AI to explain certain topics to you
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-start justify-center w-full px-12 pr-6 py-4 z-10 mt-4">
            <h1 className="text-3xl w-1/3 font-bold text-primary-text-color">
              Topics
            </h1>
            <div className="w-2/3 flex items-center justify-start">
              <h1 className="text-3xl max-w-2/5 font-bold text-primary-text-color">
                {selectedTopic ? selectedTopic.title : "Select a topic"}
              </h1>
              <div className="mx-4 flex flex-col items-end">
                <span className="text-sm font-medium text-gradient-start mb-1">
                  Progress
                </span>
                <div className="w-40 h-2.5 bg-alt-bg-color rounded">
                  <div
                    className="h-full bg-gradient-to-b from-gradient-start to-gradient-end rounded"
                    style={{
                      width:
                        topics.length > 0
                          ? `${
                              lastCompletedIndex !== null
                                ? ((lastCompletedIndex + 1) / topics.length) *
                                  100
                                : 0
                            }%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
              <button className="flex flex-row items-center justify-center hover:cursor-pointer bg-alt-bg-color px-4 py-2 text-secondary-text-color font-medium rounded-lg">
                <img
                  src={icons.sparkles}
                  alt="Sparkles Icon"
                  className="size-5 mr-2"
                />
                Ask AI
              </button>
              {currentTopicIndex === nextIndexExpected && (
                <button
                  onClick={handleCompleteLesson}
                  className="px-4 py-2 bg-gradient-to-b font-medium from-gradient-start to-gradient-end hover:cursor-pointer text-primary rounded-lg ml-4"
                >
                  Complete Lesson
                </button>
              )}
              {currentTopicIndex === lastCompletedIndex && (
                <button
                  onClick={async () => {
                    const newIndex = lastCompletedIndex! - 1;
                    setLastCompletedIndex(newIndex >= 0 ? newIndex : null);
                    if (!token) {
                      window.location.href = "/login";
                      return;
                    }
                    await updateCourseCheckpoint(
                      id!,
                      newIndex >= 0 ? newIndex : 0,
                      topics.length,
                      token,
                      API_URL
                    );
                  }}
                  className="px-4 py-2 bg-red-500 hover:cursor-pointer text-white font-medium rounded-lg ml-4"
                >
                  Uncomplete Lesson
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap w-full px-6 z-10">
            <div className="w-full md:w-1/3 flex flex-col overflow-y-auto px-4 h-[calc(100vh-280px)]">
              {topics.map((topic, index) => (
                <div
                  key={topic._id}
                  className={`p-4 cursor-pointer flex-row items-center justify-between border-b border-secondary-text-color mt-2 font-semibold text-2xl ${
                    index <=
                    (lastCompletedIndex === null ? -1 : lastCompletedIndex)
                      ? "bg-gradient-to-b from-gradient-start to-gradient-end bg-clip-text text-transparent"
                      : selectedTopic && selectedTopic._id === topic._id
                      ? "text-primary-text-color"
                      : "text-secondary-text-color"
                  }`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  {index + 1 < 10 ? `0${index + 1}` : index + 1} {topic.title}
                  {index <=
                    (lastCompletedIndex === null ? -1 : lastCompletedIndex) && (
                    <img
                      src={icons.checkmark}
                      alt="Completed"
                      className="w-4 h-4 ml-2 inline"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="w-full md:w-2/3 p-4 overflow-y-auto h-[calc(100vh-280px)]">
              {selectedTopic ? (
                <div>
                  <p className="mt-2 text-secondary-text-color">
                    {selectedTopic.summary}
                  </p>
                  <div className="mt-4 text-secondary-text-color">
                    {selectedTopic.keyPoints &&
                      selectedTopic.keyPoints.map((point: any) => (
                        <div key={point._id} className="mb-4">
                          <h2 className="font-semibold">{point.point}</h2>
                          <p>{point.explanation}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <p>Select a topic</p>
              )}
            </div>
          </div>
        </>
      )}
      <NavigationModal
        isOpen={modalOpen}
        onQuiz={() => (window.location.href = "/quiz")}
        onHome={() => (window.location.href = "/home")}
      />
    </div>
  );
};

export default TopicsPage;
