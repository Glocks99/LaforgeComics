import { Sparkles, Clock, Flame, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const More = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[100vh] flex flex-col justify-center items-center bg-gradient-to-br from-[#234] via-[#112] to-black text-gray-200 text-center px-4">
      <button
        onClick={() => navigate("/")}
        className="flex items-center w-full gap-2 px-4 py-4 text-gray-300 hover:text-yellow-400 transition"
      >
        <ChevronLeft /> Back to Home
      </button>
      <div className="flex flex-col items-center space-y-4 animate-fade-in">
        <Sparkles size={60} className="text-yellow-400 animate-pulse" />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
          Coming Soon
        </h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-xl">
          We’re working hard behind the scenes to bring you exciting new
          features and sections!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 text-left w-full max-w-3xl">
          <div className="bg-[#2a3a4a] rounded-xl p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-blue-400" size={28} />
              <h3 className="text-lg font-semibold text-gray-100">
                New Features
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              We’re adding new interactive tools, personalized recommendations,
              and more to enhance your experience.
            </p>
          </div>

          <div className="bg-[#2a3a4a] rounded-xl p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="text-red-400" size={28} />
              <h3 className="text-lg font-semibold text-gray-100">
                Hot Content
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stay tuned for exclusive comics, artist interviews, and trending
              series coming your way soon.
            </p>
          </div>

          <div className="bg-[#2a3a4a] rounded-xl p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-yellow-400" size={28} />
              <h3 className="text-lg font-semibold text-gray-100">
                Community Events
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              We’re preparing fun contests, live Q&As, and creative challenges
              to connect with fellow fans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;
