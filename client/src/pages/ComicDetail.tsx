import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  File,
  Star,
  Tag,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import RatingCard from "../components/RatingCard";

interface Episode {
  _id: string;
  title: string;
  episodeNumber: string;
  images: string[];
  releasedDate: string;
  views: number;
  isLocked: boolean;
}

interface Comic {
  _id: string;
  name: string;
  coverImage: string;
  description: string;
  author: { name: string };
  genre: { name: string };
  createdAt: string;
  episodes: Episode[];
  avgRating: number;
}

const ComicDetail = () => {
  const { setIsLoading, setIsRatingOpen, isRatingOpen, user } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [comic, setComic] = useState<Comic | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getComicById = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/comics/${id}`
      );

      if (data.success) {
        setComic(data.msg);
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getComicById();
  }, []);

  if (!comic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#10141e] text-white">
        Loading Comic...
      </div>
    );
  }

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () =>
    setCurrentPage((p) => Math.min(p + 1, comic.episodes?.length || 1));

  const currentEpisode = comic.episodes?.[currentPage - 1];

  return (
    <div className="min-h-screen bg-[#10141e] text-white flex flex-col">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="sticky top-0  backdrop-blur-2xl flex items-center gap-2 px-4 py-4 text-gray-300 hover:text-yellow-400 transition"
      >
        <ChevronLeft /> Back to Comics
      </button>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-8 px-4 sm:px-10 py-8">
        {/* Cover Image */}
        <div className="flex-shrink-0 w-full lg:w-[35%] rounded-xl overflow-hidden shadow-xl relative">
          {comic.coverImage ? (
            <img
              src={comic.coverImage}
              alt={comic.name}
              className="w-full h-80 object-cover"
            />
          ) : (
            <div className="h-80 bg-gray-700 flex items-center justify-center">
              No Cover
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
            <h1 className="text-2xl sm:text-3xl font-bold">{comic.name}</h1>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center flex-1 gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold hidden lg:block">
            {comic.name}
          </h1>
          <div className="flex justify-between sm:justify-normal flex-wrap items-center gap-2 text-gray-300 text-sm">
            <p className="flex items-center gap-1.5">
              <User size={16} />{" "}
              <span className="text-white">{comic.author?.name}</span>
            </p>
            <span className="hidden sm:inline">•</span>
            <p className="flex items-center gap-1.5">
              <Calendar size={16} /> Released:{" "}
              {comic.createdAt?.split("T")[0]}
            </p>
            <span className="hidden sm:inline">•</span>
            <p className="flex items-center gap-1.5">
              <Tag size={16} /> Genre:{" "}
              <span className="text-yellow-400">{comic.genre?.name}</span>
            </p>
            <span className="hidden sm:inline">•</span>
            <p className="flex items-center gap-1.5">
              <File size={16} /> Total Episodes: {comic.episodes?.length || 0}
            </p>
          </div>

          <div className="text-gray-300 text-sm leading-relaxed mt-2 border-t border-gray-600 pt-4 backdrop-blur-md bg-white/5 p-3 rounded-lg">
            {/* Dive into <span className="text-yellow-400">{comic.name}</span> — an
            epic {comic.genre.name} authored by{" "}
            <span className="text-white">{comic.author?.name}</span>. Use the
            Table of Contents below to jump to any page instantly. */}
            {comic.description}
          </div>

          <div className="flex items-center gap-1.5 justify-between">
            <div className="flex items-center gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={i < Math.round(comic.avgRating || 0) ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.916c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.89a1 1 0 00-1.175 0l-3.977 2.89c-.784.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.977-2.89c-.784-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.518-4.674z"
                  />
                </svg>
              ))}
              <p className="text-white/20 text-sm">
                Average Rating ({comic.avgRating?.toFixed(1) || 0})
              </p>
            </div>

            <button
              onClick={() => setIsRatingOpen(!isRatingOpen)}
              className="flex items-center gap-1.5 cursor-pointer bg-gradient-to-tr from-blue-400 to-blue-700 text-sm px-3 p-1 rounded-md"
            >
              Rate <Star size={16} />
            </button>
          </div>
        </div>
      </div>

      {isRatingOpen && (
        <RatingCard comicId={comic._id} userId={user?.user?.id} />
      )}

      {currentEpisode?.title && (
        <p className="text-xl font-bold px-10 sticky top-[50px] flex justify-between sm:justify-start"><i className="fas fa-quote-left"></i>  {currentEpisode.title} <i className="fas fa-quote-right"></i> </p>
      )}

      {/* Comic Pages */}
      <div className=" px-4 sm:px-10 mb-10">
        <div className="rounded-xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-md border border-white/10 p-4 sm:p-6 h-screen overflow-y-scroll transition-all duration-500">
        {currentEpisode && currentEpisode.images.length > 0 ? (
        <div className="flex flex-col gap-4">
              {currentEpisode.images.map((page, index) => (
                <img
                  key={index}
                  src={page}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto object-contain rounded-lg"
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">No episode pages available</p>
          )}
        </div>


        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft />
          </button>
          <span className="text-white">
            Page {currentPage} of {comic.episodes?.length || 0}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === comic.episodes?.length}
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Table of Contents */}
        <div className="mt-10 border-t border-gray-600 pt-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Table of Contents
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {comic.episodes.map((ep, index) => (
              <button
                key={ep._id || index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded border transition ${
                  currentPage === index + 1
                    ? "bg-yellow-500 text-black border-yellow-600"
                    : "bg-white/10 backdrop-blur-md text-white border-white/10 hover:bg-yellow-400 hover:text-black"
                }`}
              >
                {`Episode ${index + 1}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicDetail;
