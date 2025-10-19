import { ChevronLeft, Search } from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const suggestions = [
  { label: "Go to Comics", path: "/comics" },
  { label: "Read Blogs", path: "/blogs" },
  { label: "Explore Books", path: "/books" },
];

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[#10141e] flex flex-col justify-center items-center text-white px-4 py-12 overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-black/70 to-[#10141e] animate-pulse" />
      </div>

      {/* Logo Top Left */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
        <img
          src={assets.logo}
          alt="LaForge Logo"
          className="w-12 h-12 object-contain drop-shadow-xl"
        />
        <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">
          LaForge
        </h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-xl">
        <div className="relative">
          <h2 className="text-5xl sm:text-7xl font-extrabold text-yellow-400 animate-bounce">
            404
          </h2>
         
        </div>

        <p className="text-xl sm:text-2xl font-semibold">Page Not Found</p>

        <p className="text-gray-400 text-sm sm:text-base">
          Sorry, we can’t find the page you’re looking for. Try searching or use
          one of the suggested links below.
        </p>

        {/* Search Box */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search LaForge..."
            className="w-full py-3 pl-5 pr-12 rounded-full bg-[#1b2330] text-gray-300 placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-3 justify-center">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => navigate(s.path)}
              className="px-4 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition shadow"
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mt-4 transition font-semibold"
        >
          <ChevronLeft className="h-5 w-5" /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default Error;
