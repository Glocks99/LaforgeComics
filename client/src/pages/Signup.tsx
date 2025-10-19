import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import {EyeClosed, EyeIcon } from "lucide-react";
import { useState } from "react";

type yupSchema = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {

  const [showPassword, setShowPassword] = useState(false);

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .matches(/^\d{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const { isLoading, setIsLoading } = useAppContext();
  const { handleSubmit, register } = useForm<yupSchema>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onsubmit = async (data: Omit<yupSchema, "confirmPassword">) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BackendURL}/api/user/register`,
        { ...data },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.msg);
        navigate("/login");
      } else {
        toast.error(res.data.msg);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: any) => {
    Object.values(errors).forEach((error: any) => {
      toast.error(error.message);
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className=" inset-0 bg-black/10 backdrop-blur-2xl z-20 flex items-center justify-center">
        <div className="bg-[#1b2330] text-white rounded-lg p-6 sm:p-10 w-full max-w-lg mx-4 shadow-2xl">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer mb-4"
          >
            <img src={assets.logo} className="w-10 h-10" alt="Logo" />
            <p className="font-bold text-3xl text-yellow-400 drop-shadow">
              LaForge
            </p>
          </div>

          <h2 className="text-center text-lg sm:text-xl font-semibold mb-6">
            Create a free account
          </h2>

          <form
            onSubmit={handleSubmit(onsubmit, onError)}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="text-sm mb-1 block text-gray-300"
                >
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="w-full rounded-md px-3 py-2 bg-[#234] border border-gray-600 focus:border-yellow-500 outline-none transition"
                  required
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="text-sm mb-1 block text-gray-300"
                >
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="w-full rounded-md px-3 py-2 bg-[#234] border border-gray-600 focus:border-yellow-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm mb-1 block text-gray-300"
              >
                Email Address
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-md px-3 py-2 bg-[#234] border border-gray-600 focus:border-yellow-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="text-sm mb-1 block text-gray-300"
              >
                Phone
              </label>
              <div className="flex items-center gap-1 ">
                <div className=" rounded-md px-3 py-2 bg-[#234] border border-gray-600 focus:border-yellow-500 outline-none transition">+233</div>

              <input
                {...register("phone")}
                id="phone"
                type="tel"
                placeholder="020*******"
                className="w-full rounded-md px-3 py-2 bg-[#234] border border-gray-600 focus:border-yellow-500 outline-none transition"
                required
              />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm mb-1 block text-gray-300"
              >
                Password
              </label>

              <div className="flex items-center gap-1 ">
              <input
                {...register("password")}
                id="password"
                type={showPassword? "text" : "password"}
                placeholder="••••••"
                className="w-full rounded-md px-3 py-2 bg-[#234] border border-gray-600 focus:border-yellow-500 outline-none transition"
                required
              />

              {showPassword ? (
                <EyeClosed className="cursor-pointer text-gray-400" onClick={() => setShowPassword(false)} />
              ) : (
                <EyeIcon className="cursor-pointer text-gray-400" onClick={() => setShowPassword(true)} />
              )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm mb-1 block text-gray-300"
              >
                Confirm Password
              </label>

              <div className="flex items-center gap-1 ">
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                type= {showPassword? "text" : "password"}
                placeholder="••••••"
                className="w-full rounded-md px-3 py-2 bg-[#234] border border-gray-600 focus:border-yellow-500 outline-none transition"
                required
              />
              {showPassword ? (
                <EyeClosed className="cursor-pointer text-gray-400" onClick={() => setShowPassword(false)} />
              ) : (
                <EyeIcon className="cursor-pointer text-gray-400" onClick={() => setShowPassword(true)} />
              )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-md bg-yellow-500 text-black font-bold text-sm hover:bg-yellow-400 transition mt-4"
            >
              Create Account
            </button>

            <p className="text-center text-sm mt-4 text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-yellow-400 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
