import { useAppContext } from "../context/AppContext";

const Loader = ({ color = "text-blue-500" }) => {
  //   const dimensionClass = `h-${size} w-${size}`;
  const { darkMode } = useAppContext();

  return (
    <div
      className={`fixed inset-0 flex flex-col gap-2.5 backdrop-blur-lg items-center justify-center z-50 ${
        darkMode ? "bg-black/50" : "bg-white/50"
      }`}
    >
      <svg
        className={`animate-spin ${
          darkMode ? "text-gray-200" : "text-gray-800"
        } ${color} h-[100px]`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>

      <p>Loading...</p>
    </div>
  );
};

export default Loader;
