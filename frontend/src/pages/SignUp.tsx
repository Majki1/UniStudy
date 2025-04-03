import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupSchema } from "../schemas/auth-schemas";
// New imports for styling consistency
import loginBg from "../assets/images/LoginBg.svg";
import logoText from "../assets/icons/Logo-text.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const formData = { name, email, password, confirmPassword };
    const parsed = signupSchema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Signup failed");
      } else {
        const data = await response.json();
        console.log(data);
        toast.success("Signup successful!");
        setRedirecting(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-primary">
      <img
        src={loginBg}
        alt="Auth background"
        className="absolute z-0 w-full h-full min-h-screen object-cover"
      />
      <img
        src={logoText}
        alt="Logo"
        className="z-10 w-32 sm:w-40 h-auto mb-8"
      />
      <h1 className="z-10 text-3xl sm:text-5xl text-primary-text-color font-semibold mb-4">
        Create a new account
      </h1>
      {error && <p className="z-10 text-red-500 text-sm mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-2/3 sm:w-1/3 py-4 z-10"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-secondary-text-color mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-alt-bg-color px-3 py-2 text-secondary-text-color focus:border placeholder:text-primary-text-color/50 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-secondary-text-color mb-2"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-alt-bg-color px-3 py-2 text-secondary-text-color focus:border placeholder:text-primary-text-color/50 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-secondary-text-color mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-alt-bg-color px-3 py-2 text-secondary-text-color focus:border placeholder:text-primary-text-color/50 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-secondary-text-color mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-alt-bg-color px-3 py-2 text-secondary-text-color focus:border placeholder:text-primary-text-color/50 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-b from-gradient-start to-gradient-end text-primary py-2 rounded hover:cursor-pointer hover:bg-gradient-to-b hover:from-gradient-end hover:to-gradient-start transition-colors flex justify-center items-center"
        >
          {redirecting ? (
            <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      <p className="z-10 text-secondary-text-color mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-gradient-start hover:underline">
          Login
        </a>
      </p>
      <ToastContainer />
    </div>
  );
}

export default Signup;
