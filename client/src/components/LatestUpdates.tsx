import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

type LatestDataType = {
  _id: string;
  name: string;
  coverImage: string;
  episodes: string[];
  updatedAt: string;
};

const LatestUpdates = () => {
  const [latestData, setLatestData] = useState<LatestDataType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const {darkMode} = useAppContext()
  const ITEMS_PER_PAGE = 6;

  const getLatestComic = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/comics/popComics`);
      if (data.success) {
        setLatestData(data.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching latest comics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      getLatestComic();
    }, 2000); // simulate loading delay

    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(latestData.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = latestData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <section className={`${darkMode ? "bg-white" : "bg-[#1c2533]"} mt-16 px-4 sm:px-8 py-12 rounded-t-3xl shadow-inner`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`${darkMode ? "text-gray-800" : "text-white"} text-3xl sm:text-4xl font-extrabold mb-8 drop-shadow`}>
          🔥 Latest Updates
        </h2>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array(6)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 bg-white/5 backdrop-blur-md border border-white/10"
                  >
                    <div className="flex gap-4">
                      <Skeleton
                        height={140}
                        width={100}
                        baseColor="#2f3e52"
                        highlightColor="#3a4c5d"
                        borderRadius="0.5rem"
                      />
                      <div className="flex-1">
                        <Skeleton
                          height={20}
                          width={`80%`}
                          baseColor="#2f3e52"
                          highlightColor="#3a4c5d"
                          style={{ marginBottom: 8 }}
                        />
                        <Skeleton
                          height={14}
                          width={`60%`}
                          baseColor="#2f3e52"
                          highlightColor="#3a4c5d"
                          style={{ marginBottom: 6 }}
                        />
                        <Skeleton
                          height={12}
                          width={`40%`}
                          baseColor="#2f3e52"
                          highlightColor="#3a4c5d"
                        />
                      </div>
                    </div>
                  </div>
                ))
            : paginatedData.length === 0 ?
              <div className="flex flex-col items-center col-span-3">
                <img src="./updates.svg" className="sm:h-[350px]" alt="" />
                <p className="text-white">No updates found...</p>
              </div>
            : paginatedData.map((comic) => (
                <div
                  key={comic._id}
                  className="group relative flex rounded-xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 transition hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Comic Image */}
                  <div className="relative w-[100px] h-[140px] flex-shrink-0">
                    <img
                      src={comic.coverImage || "/comicPlaceholder.png"}
                      alt={comic.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-l-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-l-xl" />
                  </div>

                  {/* Info */}
                  <div className={`${darkMode ? "text-gray-800" : "text-white"} flex-1 p-4 relative`}>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-yellow-400 transition">
                      {comic.name}
                    </h3>
                    <p className={`${darkMode ? "text-gray-800 border border-gray-800" : "bg-white/10 border border-white/20 text-gray-200"} text-sm inline-block px-3 font-medium rounded-full backdrop-blur-md`}>
                      {comic.episodes?.length || 0} Episodes
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Updated: {new Date(comic.updatedAt).toLocaleDateString()}
                    </p>
                    <Link
                      to={"comic_detail/" + comic._id}
                      className="inline-block mt-4 text-blue-400 hover:text-yellow-400 text-sm font-medium transition"
                    >
                      Read Now →
                    </Link>
                  </div>
                </div>
              ))
            
          }
        </div>

        {/* Pagination */}
        {!loading && latestData.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 disabled:opacity-40 transition"
            >
              Prev
            </button>
            <span className="text-gray-200 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestUpdates;
