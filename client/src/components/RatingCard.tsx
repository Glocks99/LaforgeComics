import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

type RatingCardProps = {
  comicId: string;
  userId: string;
};

const Star = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-6 h-6 ${filled ? "text-yellow-400" : "text-gray-300"}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.376 2.455c-.784.57-1.84-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.63 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.966z" />
  </svg>
);

export default function RatingCard({ comicId, userId }: RatingCardProps) {
  const [score, setScore] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const { setIsRatingOpen, isRatingOpen } = useAppContext();

  // ✅ Fetch user's previous rating for this comic (if any)
  useEffect(() => {
    const fetchExistingRating = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BackendURL}/api/ratings/${userId}/${comicId}`
        );
        if (res.data?.rating) {
          setScore(res.data.rating.score);
          setFetched(true);
        }
      } catch (err) {
        console.error("No existing rating found or failed to fetch rating");
      }
    };
    fetchExistingRating();
  }, [userId, comicId]);

  // ✅ Submit rating
  const handleSubmit = async () => {
    if (!score) {
      toast.error("Please select a star rating before submitting.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BackendURL}/api/ratings/${userId}`,
        { score, comicId }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success(fetched ? "Rating updated!" : "Rating submitted!");
        setTimeout(() => setIsRatingOpen(false), 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-2xl bg-black/40 z-50">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-5 relative">
        <button
          onClick={() => setIsRatingOpen(!isRatingOpen)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X />
        </button>

        <h3 className="text-lg font-semibold text-gray-800">
          {fetched ? "Update your rating" : "Rate this Comic"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          How was the comic? Choose stars to rate this comic (optional).
        </p>

        {/* ⭐ Stars */}
        <div className="mt-4 flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = hover !== null ? n <= hover : n <= score;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setScore(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(null)}
                className="focus:outline-none"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                <Star filled={filled} />
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-500 mt-2">
          {score === 0
            ? "No rating yet"
            : `${score} star${score > 1 ? "s" : ""}`}
        </p>
      

        {/* ⚙️ Buttons */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setScore(0);
            }}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm text-white shadow-sm ${
              loading
                ? "bg-green-300 cursor-wait"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            }`}
          >
            {loading ? "Submitting..." : fetched ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
