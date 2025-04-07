import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { images } from "../constants/images";
import NavBar from "../components/NavBar";

function QuizSuccess() {
  const [searchParams] = useSearchParams();
  const score = Number(searchParams.get("score")) || 0; // retrieve score from URL
  const navigate = useNavigate(); // added navigate hook

  useEffect(() => {
    console.log("Score:", score);
  }, [score]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary">
      <img
        src={images.rays}
        alt="Rays"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30 z-0"
      />
      <div className="flex flex-col items-center w-full min-h-screen justify-start z-10">
        <NavBar authenticated={true} />
        <img src={images.crownSuccess} alt="Crown Fail" className="mb-4" />
        <h1 className="text-2xl font-bold text-primary-text-color w-1/2 text-center">
          <span className="bg-gradient-to-b from-gradient-start to-gradient-end bg-clip-text text-transparent">
            Congrats,
          </span>{" "}
          you scored{" "}
          <span className="bg-gradient-to-b from-gradient-start to-gradient-end bg-clip-text text-transparent">
            {score.toString()}%,
          </span>{" "}
          on this quiz, which is a passing grade making this course{" "}
          <span className="bg-gradient-to-b from-gradient-start to-gradient-end bg-clip-text text-transparent">
            effectively complete
          </span>{" "}
        </h1>
        <button
          onClick={() => navigate("/home")} // updated onClick handler
          className="bg-gradient-to-b w-50 from-gradient-start to-gradient-end text-primary font-bold text-base px-8 py-2 rounded-md mt-8 hover:cursor-pointer"
        >
          Complete Course
        </button>
        <img
          src={images.wizardShocked}
          alt="Arcanist"
          className="absolute bottom-12 left-12"
        />
      </div>
    </div>
  );
}

export default QuizSuccess;
