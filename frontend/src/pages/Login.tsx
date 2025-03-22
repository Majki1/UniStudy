import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth-schemas";
import { LoginFormInputs } from "../types/types";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch("http://localhost:3000/auth/login", {
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Login
        </button>
      </form>
      <button
        onClick={() => {
          navigate("/signup");
        }}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
      >
        Register
      </button>
    </>
  );
}

export default Login;
