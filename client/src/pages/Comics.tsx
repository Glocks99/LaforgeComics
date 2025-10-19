import {
  Share2,
  Loader,
  BookOpen,
  User,
  Calendar,
  Tag,
} from "lucide-react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { useAppContext } from "../context/AppContext";
import MenuCarousel from "../components/MenuCarousel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

type Comic = {
  _id: string;
  name: string;
  description: string;
  isPublished: boolean;
  views: number;
  coverImage: string;
  author: {
    name: string;
  };
  date: string;
  genre: {
    name: string;
  };
  createdAt: string;
  likeCount?: number;
};

const ITEMS_PER_PAGE = 5;

const Comics = () => {
  const navigate = useNavigate();
  const { isLoading, setIsLoading, user } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [comics, setComics] = useState<Comic[]>([]);
  const [likedComics, setLikedComics] = useState<string[]>([]);

   const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.user?.id || parsedUser?._id || parsedUser?.id || null;


  // ✅ Fetch all comics
  const getAllComics = async () => {
  try {
    const [comicRes, likeMap] = await Promise.all([
      axios.get(`${import.meta.env.VITE_BackendURL}/api/comics`),
      getAllComicsLikes(),
    ]);

    if (comicRes.data?.success) {
      const comicsWithLikes = comicRes.data.msg.map((comic: any) => ({
        ...comic,
        likeCount: likeMap[comic._id] || 0,
      }));
      setComics(comicsWithLikes);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => setIsLoading(false), 2000);
  }
};


  const getAllComicsLikes = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/likes/all`);
    if (data.success) {
      const likeMap = data.likes.reduce((acc: any, item: any) => {
        acc[item.comic] = item.totalLikes;
        return acc;
      }, {});
      return likeMap;
    }
  } catch (error) {
    console.error("Error fetching all comic likes:", error);
  }
  return {};
};


  // ✅ Fetch liked comics for current user
  const getUserLikes = async () => {
    try {
      if (!userId) return;
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/likes/user/${userId}`
      );
      if (data.success) {
        setLikedComics(data.likes.map((like: any) => like.comic));
      }
    } catch (error) {
      console.error("Error fetching user likes:", error);
    }
  };

  useEffect(() => {
    getAllComics();
    getUserLikes(); 
  }, []);

  // ✅ Run only when userId becomes available
  useEffect(() => {
    if (userId) {
      getUserLikes();
    }
  }, [userId]);

  const totalPages = Math.ceil(comics.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentComics = comics.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // ✅ Handle like/unlike
// ✅ Handle like/unlike
const handleLike = async (comicId: string) => {
  if (!userId) {
    toast.error("Please login to like comics.");
    return;
  }

  // Optimistic UI update
  const isLiked = likedComics.includes(comicId);
  setLikedComics((prev) =>
    isLiked ? prev.filter((id) => id !== comicId) : [...prev, comicId]
  );
  setComics((prev) =>
    prev.map((comic) =>
      comic._id === comicId
        ? {
            ...comic,
            likeCount: (comic.likeCount || 0) + (isLiked ? -1 : 1),
          }
        : comic
    )
  );

  try {
    const { data } = await axios.post(`${import.meta.env.VITE_BackendURL}/api/likes`, {
      userId,
      comicId,
    });

    if (data.success) {
      // ✅ Sync backend count and liked status
      setLikedComics((prev) =>
        data.liked
          ? [...new Set([...prev, comicId])]
          : prev.filter((id) => id !== comicId)
      );

      setComics((prev) =>
        prev.map((comic) =>
          comic._id === comicId
            ? { ...comic, likeCount: data.totalLikes }
            : comic
        )
      );
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    toast.error("Error toggling like");

    // Rollback UI if request failed
    setLikedComics((prev) =>
      isLiked ? [...prev, comicId] : prev.filter((id) => id !== comicId)
    );
    setComics((prev) =>
      prev.map((comic) =>
        comic._id === comicId
          ? {
              ...comic,
              likeCount: (comic.likeCount || 0) + (isLiked ? 1 : -1),
            }
          : comic
      )
    );
  }
};


  // ✅ Share comic
  const handleShare = async (comic: Comic) => {
    const url = `${window.location.origin}/comic_detail/${comic._id}`;
    const text = `Check out "${comic.name}" on our comics site!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: comic.name, text, url });
      } catch (err) {
        console.error("Share cancelled", err);
      }
    } else {
      // Fallback: copy link
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  useEffect(() => {
  getAllComics(); // load everything once

  const syncInterval = setInterval(() => {
    getAllComicsLikes().then((likeMap) => {
      setComics((prev) =>
        prev.map((comic) => ({
          ...comic,
          likeCount: likeMap[comic._id] || 0,
        }))
      );
    });
  }, 10000); // 🔁 refresh every 10 seconds

  return () => clearInterval(syncInterval); // cleanup on unmount
}, []);


  const skeletonItems = new Array(4).fill(null);

  return (
    <div className="relative min-h-screen bg-[#0e121a]">
      {isLoading && (
        <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      <SideBar />
      <Header />
      <MenuCarousel />

      <main className="mt-12 px-4 sm:px-10 pb-5">
        <section className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-8 drop-shadow">
            📚 Trending Comics
          </h1>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentComics.length === 0
              ? skeletonItems.map((_, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-md bg-white/5 border border-white/10 animate-pulse p-4 rounded-xl shadow-lg"
                  >
                    <div className="bg-gray-700/40 h-48 w-full rounded mb-4" />
                    <div className="h-4 bg-gray-700/40 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-700/30 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-700/30 rounded w-2/3 mb-4" />
                    <div className="h-8 bg-gray-700/40 rounded w-full" />
                  </div>
                ))
              : currentComics.map((comic) => (
                  <div
                    key={comic._id}
                    className="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-[1.03] transition duration-500 backdrop-blur-md bg-white/5 border border-white/10"
                  >
                    {/* Cover */}
                    <div className="relative h-0 pb-[135%]">
                      <img
                        src={comic.coverImage || "comicPlaceholder.png"}
                        alt={comic.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-500 flex items-start justify-end p-4 gap-3">
                        <button
                          onClick={() => handleLike(comic._id)}
                          className={`p-2 rounded-full backdrop-blur-md bg-black/30 border border-white/20 text-white transition ${
                            likedComics.includes(comic._id)
                              ? "text-red-500"
                              : "hover:text-red-400"
                          }`}
                        >
                          {likedComics.includes(comic._id) ? "❤️ Liked" : "🤍 Like"}
                        </button>
                        <button
                          onClick={() => handleShare(comic)}
                          className="p-2 rounded-full backdrop-blur-md bg-black/30 border border-white/20 text-white hover:text-blue-400 transition"
                        >
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
                      <h2 className="text-lg font-bold truncate text-white drop-shadow">
                        {comic.name}
                      </h2>

                      <div className="flex items-center justify-between gap-2 text-xs text-gray-300 mt-1">
                        <p className="truncate flex items-center gap-1.5">
                          <User size={14} /> {comic.author?.name || "Unknown"}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(comic.createdAt)
                            .toLocaleDateString()
                            .split("/")
                            .join("-")}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2">
                        <span className="text-xs uppercase tracking-wider flex items-center gap-1.5 text-gray-200">
                          <Tag size={14} /> GENRE
                        </span>
                        <span className="text-xs backdrop-blur-md bg-white/10 border border-white/20 py-0.5 px-2 rounded font-semibold text-white">
                          {comic.genre?.name || "N/A"}
                        </span>
                      </div>

                      <button
                        onClick={() => navigate("/comic_detail/" + comic._id)}
                        className="flex items-center justify-center gap-2 mt-4 text-sm backdrop-blur-md bg-white/10 border border-white/20 py-2.5 rounded-lg hover:bg-white/20 transition text-white font-medium w-full"
                      >
                        <BookOpen className="h-5 w-5" />
                        Read Now
                      </button>
                    </div>
                  </div>
                ))}
          </div>

          {comics.length > 0 && (
            <div className="flex justify-center gap-6 mt-10 items-center">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg backdrop-blur-md bg-white/5 border border-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition"
              >
                Prev
              </button>
              <span className="text-white/80 text-sm font-medium backdrop-blur-md bg-white/5 border border-white/20 px-3 py-1.5 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg backdrop-blur-md bg-white/5 border border-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Comics;
