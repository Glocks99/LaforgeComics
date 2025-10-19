import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement[]>([]);
  const { setUser, sendverifyEmail } = useAppContext();

  const [time, setTime] = useState("01:00");
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  const formatTime = (seconds: number) => {
    const minutesPart = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secondsPart = String(seconds % 60).padStart(2, "0");
    return `${minutesPart}:${secondsPart}`;
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isTimerRunning) {
      let secondsRemaining = 60; // Start at 1 minute

      // Set initial time immediately
      setTime(formatTime(secondsRemaining));

      intervalId = setInterval(() => {
        secondsRemaining--;
        setTime(formatTime(secondsRemaining));

        if (secondsRemaining <= 0) {
          clearInterval(intervalId);
          setIsTimerRunning(false);
          setTime(""); // Clear timer display
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isTimerRunning]);

  const handleVerify = async () => {
    const otp = inputRef.current
      .map((input) => input.value)
      .join("")
      .trim();

    if (otp.length !== 6) {
      return toast.error("Please enter the 6-digit OTP code!", { icon: "⚠" });
    }

    const toastId = toast.loading("Verifying your email...");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BackendURL}/api/user/verify-otp`,
        { otp },
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
      toast.error(error.response?.data?.message || error.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (value && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      (e.target as HTMLInputElement).value === "" &&
      index > 0
    ) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    inputRef.current.forEach((input) => (input.value = "")); // clear
    paste.split("").forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
    if (paste.length === 6) {
      handleVerify();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#10141e] to-[#1e293b] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl relative">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 p-4 rounded-full shadow-lg">
          <ShieldCheck className="text-white h-8 w-8" />
        </div>

        <div className="px-8 py-10 text-center" onPaste={handlePaste}>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600 mb-6">
            Enter the 6-digit OTP code we sent to your email to verify your
            account.
          </p>

          <div className="flex items-center justify-center gap-2 mb-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <input
                  key={i}
                  type="text"
                  onChange={(e) => handleInput(e, i)}
                  onKeyDown={(e) => handleKey(e, i)}
                  maxLength={1}
                  ref={(el) => {
                    if (el) inputRef.current[i] = el;
                  }}
                  className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl text-gray-800 font-bold focus:outline-none focus:border-blue-500 transition"
                />
              ))}
          </div>

          <button
            onClick={handleVerify}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Verify Now
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Didn’t receive the code?{" "}
            {isTimerRunning ? (
              <span className="text-blue-600 font-semibold">{time}</span>
            ) : (
              <button
                onClick={() => {
                  setIsTimerRunning(true);
                  sendverifyEmail();
                }}
                className="text-blue-600 hover:underline"
              >
                Resend
              </button>
            )}
          </p>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmail;
