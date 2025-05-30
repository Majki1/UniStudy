// App.tsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Quiz from "./pages/Quiz";
import QuizFail from "./pages/QuizFail";
import QuizSuccess from "./pages/QuizSuccess";

// Lazy load pages for better performance
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Topics = lazy(() => import("./pages/Topics"));
const LoadingScreen = lazy(() => import("./pages/Loading"));
const MyCourses = lazy(() => import("./pages/MyCourses")); // Add import for MyCourses

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-2xl">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/topics/:id" element={<Topics />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/quizfail" element={<QuizFail />} />
          <Route path="/quizsuccess" element={<QuizSuccess />} />
          <Route path="/mycourses" element={<MyCourses />} />
          {/* Redirect unknown routes to onboarding */}
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
