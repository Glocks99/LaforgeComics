import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

type yupSchema = {
  email: string;
  password: string;
};

const Login = () => {
  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const { handleSubmit, register } = useForm<yupSchema>({
    resolver: yupResolver(schema),
  });
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const onsubmit = async (yupData: yupSchema) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BackendURL}/api/user/login`,
        { ...yupData },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.msg);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser({ isLoggedIn: true, user: data.user });
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(data.msg);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const onError = (errors: any) => {
    Object.values(errors).forEach((error: any) => toast.error(error.message));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-[#1f2937] text-white p-6 mx-2 rounded-xl shadow-2xl w-full sm:w-[450px] animate-fadeIn relative">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center justify-center mb-6 cursor-pointer select-none"
        >
          <img
            src={assets.logo}
            alt="LaForge Logo"
            className="w-10 h-10 mr-2 drop-shadow-md"
          />
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            LaForge
          </p>
        </div>

        <h2 className="text-center text-sm font-light mb-6">
          Login to your account
        </h2>

        <form onSubmit={handleSubmit(onsubmit, onError)} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <div className="flex items-center bg-[#374151] border border-gray-600 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <i className="fas fa-envelope text-gray-400 mr-2"></i>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full bg-transparent focus:outline-none placeholder-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <div className="flex items-center bg-[#374151] border border-gray-600 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <i className="fas fa-lock text-gray-400 mr-2"></i>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className="w-full bg-transparent focus:outline-none placeholder-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm mt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="accent-blue-500 h-4 w-4" />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition text-center"
          >
            Login
          </button>

          {/* Signup link */}
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
