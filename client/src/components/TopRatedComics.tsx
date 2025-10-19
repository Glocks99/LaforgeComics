import axios from "axios";
import { User2 } from "lucide-react";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppContext } from "../context/AppContext";

type ComicType = {
  comic: {
    _id: string;
    title?: string;
    author?: {
      name: string;
    };
    description?: string;
    coverImage?: string;
  };
  avgScore: number;
  totalRatings: number;
};

const TopRatedComics = () => {
  const [loading, setLoading] = useState(true);
  const [topRatedData, setTopRatedData] = useState<ComicType[]>([]);
  const {darkMode} = useAppContext()

  const getTopRatedComicsByAvg = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/ratings/topRated`);

      if (data?.success && Array.isArray(data.msg)) {
        setTopRatedData(data.msg);
      } else {
        setTopRatedData([]);
      }
    } catch (error) {
      console.error("Error fetching top rated comics:", error);
      setTopRatedData([]);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  useEffect(() => {
    getTopRatedComicsByAvg();
  }, []);

  return (
    <div className={`mt-10 ${darkMode ? "bg-white text-gray-800" : "bg-gradient-to-b from-[#1b2330] to-[#234]"} px-4 sm:px-10 py-10 rounded-2xl shadow-inner`}>
      <h2 className={`text-3xl sm:text-4xl font-bold mb-8 ${darkMode ? "text-gray-800" : "text-white"} text-center tracking-wide`}>
        🌟 Top Rated Comics
      </h2>

      {!loading && topRatedData.length === 0 && (
        <div className="flex flex-col">
          <img className="sm:h-[350px]" src="./review.svg" alt="" />
          <p className="text-center text-white">No ratings at the moment...</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {(loading ? Array(4).fill({}) : topRatedData).map((item, index) => {
          const comic = item.comic || {};
          return (
            <div
              key={comic._id || index}
              className={`relative flex flex-col ${darkMode ? "bg-white" : "bg-[#2d3a4d]"} rounded-2xl transition transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 group`}
            >
              {/* Cover */}
              <div className="relative w-full overflow-hidden rounded-t-lg mb-4">
                {loading ? (
                  <Skeleton
                    height={200}
                    borderRadius={12}
                    baseColor="#3a475b"
                    highlightColor="#4a5b72"
                  />
                ) : (
                  <>
                    <img
                      src={comic.coverImage || "/comicPlaceholder.png"}
                      alt={comic.title || "Comic"}
                      className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow">
                      #{index + 1}
                    </span>

                    <div className="absolute -bottom-1 z-40 left-0 right-0 h-24 bg-gradient-to-t from-[#234] to-transparent"></div>
                  </>
                )}
              </div>

              {/* Text Section */}
              <div className="flex flex-col flex-grow justify-between p-4">
                {/* Comic Title */}
                <h3 className={`text-lg font-bold ${darkMode ? "text-gray-800" : "text-white"} mb-1 line-clamp-2`}>
                  {loading ? (
                    <Skeleton width={"80%"} baseColor="#3a475b" highlightColor="#4a5b72" />
                  ) : (
                    comic.name || "Untitled Comic"
                  )}
                </h3>

                {/* Author */}
                <div className={`text-sm ${darkMode ? "text-gray-800" : "text-gray-300"} mb-2`}>
                  {loading ? (
                    <Skeleton width={100} baseColor="#3a475b" highlightColor="#4a5b72" />
                  ) : (
                    <div className="flex items-center gap-1">
                      <User2 size={16} />
                      {comic.author?.name || "Unknown Author"}
                    </div>
                  )}
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
                  {loading ? (
                    <Skeleton width={100} baseColor="#3a475b" highlightColor="#4a5b72" />
                  ) : (
                    <>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          fill={i < Math.round(item.avgScore || 0) ? "currentColor" : "none"}
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
                      <span className={`${darkMode ? "text-gray-800" : "bg-white/10 border border-white/20 text-gray-200"} ml-2 inline-block px-3 py-1 text-xs font-medium rounded-full backdrop-blur-md`}>
                        {item.avgScore?.toFixed(1)}/5 ({item.totalRatings} ratings)
                      </span>
                    </>
                  )}
                </div>

                {/* CTA */}
                {loading ? (
                  <Skeleton width={80} baseColor="#3a475b" highlightColor="#4a5b72" />
                ) : (
                  <a
                    href={`/comic_detail/${comic._id}`}
                    className={`${darkMode ? "text-gray-800 border border-gray-600" : "bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20"} inline-block px-3 py-1 text-xs font-medium rounded-full backdrop-blur-md transition`}
                  >
                    Read Now →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopRatedComics;
