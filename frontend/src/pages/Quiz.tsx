import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookies";
import { fetchCourseDetails } from "../utils/courseApi";
import NavBar from "../components/NavBar";
import { images } from "../constants/images";
import quotes from "../constants/motivationalQuotes.json";

// Add a type annotation for quotes to avoid implicit any error
const motivQuotes: string[] = quotes as string[];

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Separate loading states
  const [courseLoading, setCourseLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(true);

  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [chaptersId, setChaptersId] = useState<string | null>(null);
  const [quizId, setQuizId] = useState("");
  const token = getCookie("accessToken");
  const API_URL = "http://localhost:3000";

  const getRandomQuote = () =>
    motivQuotes[Math.floor(Math.random() * motivQuotes.length)];
  const [randomQuote, setRandomQuote] = useState(getRandomQuote());

  useEffect(() => {
    const fetchCourse = async () => {
      setCourseLoading(true);
      try {
        if (!id || !token) return;
        const course = await fetchCourseDetails(id, token, API_URL);
        console.log("course", course);
        setQuizId(course?.quizId);
        setChaptersId(course?.chaptersId || null);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setCourseLoading(false);
      }
    };
    fetchCourse();
  }, [id, token]);

  useEffect(() => {
    const generateQuiz = async () => {
      setQuizLoading(true);
      try {
        const response = await fetch(`${API_URL}/quizzes/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chaptersId,
            courseId: id,
          }),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log("Quiz generated:", data);
        // Use the quizData.chapters field from the response
        if (
          data.data &&
          data.data.quizData &&
          Array.isArray(data.data.quizData.chapters)
        ) {
          setQuizQuestions(data.data.quizData.chapters);
        } else {
          setQuizQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setQuizLoading(false);
      }
    };

    const fetchQuiz = async () => {
      setQuizLoading(true);
      try {
        const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log("Quiz fetched:", data);
        // Check for both response formats: wrapped in data or direct
        let chapters = [];
        if (
          data.data &&
          data.data.quizData &&
          Array.isArray(data.data.quizData.chapters)
        ) {
          chapters = data.data.quizData.chapters;
        } else if (data.quizData && Array.isArray(data.quizData.chapters)) {
          chapters = data.quizData.chapters;
        }
        setQuizQuestions(chapters);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setQuizLoading(false);
      }
    };

    // Only trigger quiz generation or fetch if chaptersId is available
    if (chaptersId) {
      if (quizId === "") {
        generateQuiz();
      } else {
        fetchQuiz();
      }
    }
  }, [quizId, chaptersId, id]);

  const handleNext = () => {
    setUserAnswers([...userAnswers, userAnswer]);
    setUserAnswer("");
    setRandomQuote(getRandomQuote()); // update random quote on each answer submission
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Evaluate quiz using 'correctAnswer' property
      let correctCount = 0;
      const allAnswers = [...userAnswers, userAnswer];
      quizQuestions.forEach((q, index) => {
        if (
          allAnswers[index] &&
          allAnswers[index].trim().toLowerCase() ===
            q.correctAnswer.trim().toLowerCase()
        ) {
          correctCount++;
        }
      });
      const scorePercentage = (correctCount / quizQuestions.length) * 100;
      console.log("Score:", scorePercentage);
      if (scorePercentage < 50) {
        navigate("/quizfail");
      } else {
        navigate("/quizsuccess");
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setUserAnswer(userAnswers[newIndex] || "");
      setUserAnswers((prev) => prev.slice(0, newIndex));
    }
  };

  if (courseLoading || quizLoading) return <p>Loading...</p>;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="h-screen flex flex-col items-center bg-primary justify-start">
      <img
        src={images.rays}
        alt="Background"
        className="absolute z-0 top-0 left-0 w-full h-full object-cover opacity-20"
      />
      <NavBar authenticated={true} />
      <div className="flex flex-row items-start justify-start gap-x-32 w-full h-full px-8 z-10">
        <div className="flex flex-col items-start justify-center w-1/3 mt-30">
          <div>
            <h2 className="text-2xl font-bold text-primary-text-color mt-10">
              {currentQuestion.question}
            </h2>
            <ul className="mt-5">
              {currentQuestion.answers.map((option: string, idx: number) => (
                <li key={idx} className="mb-4">
                  <button
                    onClick={() => setUserAnswer(option)}
                    className={`py-2 px-4 rounded-lg w-full text-left hover:cursor-pointer ${
                      userAnswer === option
                        ? "bg-gradient-to-b from-gradient-start to-gradient-end text-primary"
                        : "bg-alt-bg-color text-secondary-text-color"
                    }`}
                  >
                    {String.fromCharCode(97 + idx)}. {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-row justify-end w-full mt-4">
            <button
              className="bg-alt-bg-color text-secondary-text-color py-2 px-4 rounded-lg mr-4 hover:cursor-pointer"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous Question
            </button>
            <button
              className="bg-gradient-to-b from-gradient-start to-gradient-end text-primary py-2 px-4 rounded-lg hover:cursor-pointer"
              disabled={!userAnswer}
              onClick={handleNext}
            >
              {currentQuestionIndex === quizQuestions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </div>
        </div>
        <div className="flex flex-row items-start justify-center h-full w-2/3 mt-40">
          <div className="flex flex-col items-start justify-center w-full">
            <h1 className="text-2xl font-bold text-primary-text-color mb-4">
              Questions
            </h1>
            {/* Question navigation buttons */}
            <div className="grid grid-cols-5 gap-2">
              {quizQuestions.map((_, index) => {
                let btnClass =
                  "py-2 px-4 rounded-lg hover:cursor-pointer font-bold";
                if (index === currentQuestionIndex) {
                  btnClass +=
                    " bg-gradient-to-b from-gradient-start to-gradient-end text-primary";
                } else if (userAnswers[index] !== undefined) {
                  btnClass += " bg-alt-bg-color text-gradient-end";
                } else {
                  btnClass += " bg-alt-bg-color text-secondary-text-color";
                }
                return (
                  <button
                    key={index}
                    className={btnClass}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setUserAnswer(userAnswers[index] || "");
                      setUserAnswers((prev) => prev.slice(0, index));
                    }}
                  >
                    {index + 1}.
                  </button>
                );
              })}
            </div>
          </div>
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            <div className="relative bg-alt-bg-color rounded-lg p-4 w-3/4 shadow-lg">
              <p className="text-sm font-medium text-secondary-text-color">
                {randomQuote}
              </p>
              {/* Chat bubble pointer */}
              <div className="absolute bottom-[-10px] left-6 w-0 h-0 border-t-[10px] border-t-alt-bg-color border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent" />
            </div>
            <img
              src={images.frostKnight}
              alt="Knight"
              className="w-1/2 h-auto mr-52"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
