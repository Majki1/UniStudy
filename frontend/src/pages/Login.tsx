import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth-schemas";
import { LoginFormInputs } from "../types/types";
import { useNavigate } from "react-router-dom";
import logoText from "../assets/icons/Logo-text.svg";
import loginBg from "../assets/images/LoginBg.svg";
import google from "../assets/icons/Google.svg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Login() {
  // Configure React Hook Form with Zod resolver
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const tokens = await response.json();
        // Save tokens in cookies; adjust cookie attributes as needed
        document.cookie = `accessToken=${tokens.accessToken}; path=/;`;
        document.cookie = `refreshToken=${tokens.refreshToken}; path=/;`;
        navigate("/home");
      } else {
        const errData = await response.json();
        console.error("Login error:", errData.message || "Login failed");
      }
    } catch (err) {
      console.error("An error occurred:", err);
    }
  };

  // New function for handling Google login
  const handleGoogleLogin = async () => {
    // Replace the fake token with the actual Google sign-in flow
    const idToken = "FAKE_GOOGLE_ID_TOKEN"; // TODO: get real token from Google auth
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (response.ok) {
        const tokens = await response.json();
        document.cookie = `accessToken=${tokens.accessToken}; path=/;`;
        document.cookie = `refreshToken=${tokens.refreshToken}; path=/;`;
        navigate("/home");
      } else {
        const errData = await response.json();
        console.error("Google login error:", errData.error || "Login failed");
      }
    } catch (err) {
      console.error("An error occurred:", err);
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
        Log in to your account
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-2/3 sm:w-1/3 py-4 z-10"
      >
        <div className="mb-4">
          <label
            className="block text-secondary-text-color mb-1"
            htmlFor="email"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email..."
            {...register("email")}
            className="w-full bg-alt-bg-color px-3 py-2 text-secondary-text-color focus:border placeholder:text-primary-text-color/50 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-secondary-text-color mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password..."
            {...register("password")}
            className="w-full bg-alt-bg-color px-3 py-2 text-secondary-text-color focus:border placeholder:text-primary-text-color/50 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
          <a href="#" className="text-sm text-gradient-start mt-2 block">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-gradient-start to-gradient-end text-primary py-2 rounded hover:cursor-pointer hover:bg-gradient-to-r hover:from-gradient-end hover:to-gradient-start transition-colors"
        >
          Login
        </button>
      </form>
      <div className="z-10 w-2/3 sm:w-1/3 flex items-center my-4">
        <hr className="flex-grow border-t border-primary-text-color/30" />
        <span className="px-2 text-secondary-text-color">or</span>
        <hr className="flex-grow border-t border-primary-text-color/30" />
      </div>
      <button
        onClick={handleGoogleLogin}
        className="z-10 flex flex-row justify-center gap-x-2 w-2/3 sm:w-1/3 bg-alt-bg-color text-secondary-text-color font-medium py-2 rounded hover:cursor-pointer hover:bg-alt-bg-color/80 transition-colors mt-4"
      >
        <img src={google} alt="Google Logo" className="mt-1" /> Continue with
        Google
      </button>
      <p className="z-10 text-secondary-text-color font-bold mt-4">
        New here?{" "}
        <a href="/signup" className="text-gradient-start font-medium">
          Sign Up Now
        </a>
      </p>
    </div>
  );
}

export default Login;
