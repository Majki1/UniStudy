import React from "react";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Optionally, persist the onboarding status (e.g., localStorage.setItem('hasOnboarded', 'true'))
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to UniStudy!
        </h1>
        <p className="text-gray-600 mb-6">
          Discover a new way to learn with interactive courses and gamified
          quizzes. Dive in and start your personalized learning journey!
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
