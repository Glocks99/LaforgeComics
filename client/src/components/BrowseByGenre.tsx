import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

type Comic = {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  genre: {
    name: string;
    description?: string;
  };
};

type Genre = {
  name: string;
  description: string;
};

const BrowseByGenre = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [comics, setComics] = useState<Comic[]>([]);
  const [genresList, setGenresList] = useState<string[]>(["All"]);
  const {darkMode} = useAppContext()

  const ITEMS_PER_PAGE = 6;

  const getGenres = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/genres`);
      if (data.success) {
        const names = data.msg.map((g: Genre) => g.name);
        setGenresList(["All", ...names]);
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const getComics = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/comics`);
      if (data?.success) {
        setComics(data.msg);
      }
    } catch (error) {
      console.error("Error fetching comics:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    getGenres();
    getComics();
  }, []);

  const filteredCards =
    selectedGenre !== "All"
      ? comics.filter((card) => card.genre.name === selectedGenre)
      : comics;

  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCards = filteredCards.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className={`${darkMode ? "bg-white" : "bg-[#1c2533]"} mt-12 px-4 sm:px-8 py-10 rounded-t-3xl shadow-inner`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className={`${darkMode ? "text-gray-800" : "text-white"} text-3xl sm:text-4xl font-extrabold drop-shadow`}>
            📚 Browse by Genre
          </h2>
          <Link
            to="/comics"
            className="text-blue-400 hover:underline font-semibold transition"
          >
            View All →
          </Link>
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {genresList.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 ${darkMode ? "text-gray-800" : ""} rounded-full text-sm font-medium transition shadow-sm backdrop-blur-md ${
                selectedGenre === genre
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Cards or Skeletons */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden border border-gray-700 bg-[#1c2533] shadow-md"
              >
                <Skeleton
                  height={250}
                  className="w-full"
                  baseColor="#2f3e52"
                  highlightColor="#3f4e65"
                />
                <div className="p-4">
                  <Skeleton
                    height={22}
                    width="70%"
                    baseColor="#2f3e52"
                    highlightColor="#3f4e65"
                  />
                  <Skeleton
                    height={16}
                    count={2}
                    style={{ marginTop: "8px" }}
                    baseColor="#2f3e52"
                    highlightColor="#3f4e65"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedCards.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginatedCards.map((card, idx) => (
              <Link to={"/comic_detail/" + card._id}
                key={idx}
                className="relative rounded-2xl overflow-hidden shadow-lg border border-white/10 group hover:scale-[1.02] transition-transform duration-500 backdrop-blur-md bg-white/5"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: card.coverImage
                      ? `url(${card.coverImage})`
                      : "url(./comicPlaceholder.png)",
                  }}
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col justify-end h-72">
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">
                    {card.name}
                  </h3>
                  <p className="text-gray-100 text-sm line-clamp-3">
                    {card.description}
                  </p>

                  {/* Genre Badge */}
                  <span className="mt-3 inline-block px-3 py-1 text-xs font-medium rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-gray-200">
                    {card.genre?.name || "Unknown"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-gray-300 text-center py-12 text-lg flex flex-col items-center">
            <img className="sm:h-[350px]" src="./results.svg" alt="" />
            
            <p className="">
              No results found for{" "}
              <span className="text-yellow-400 font-semibold">{selectedGenre}</span>
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredCards.length > ITEMS_PER_PAGE && (
          <div className="mt-10 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded backdrop-blur-md bg-white/10 border border-white/20 text-white disabled:opacity-40 hover:bg-white/20 transition"
            >
              Prev
            </button>
            <span className="text-white text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded backdrop-blur-md bg-white/10 border border-white/20 text-white disabled:opacity-40 hover:bg-white/20 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseByGenre;
