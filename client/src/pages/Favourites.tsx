import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, HeartCrack, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

type Comic = {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  author?: {
    name?: string;
  };
  likeCount?: number;
};

const Favourites = () => {
  const {user} = useAppContext()
  const [comics, setComics] = useState<Comic[]>([]);
  const [likedComics, setLikedComics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.user?.id || parsedUser?._id || parsedUser?.id || null;// userId from route params

  const navigate = useNavigate()

  // ✅ Fetch all comics & their likes
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
      console.error("Error fetching comics:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  // ✅ Map of comicId → totalLikes
  const getAllComicsLikes = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/likes/all`
      );
      if (data.success) {
        return data.likes.reduce((acc: any, item: any) => {
          acc[item.comic] = item.totalLikes;
          return acc;
        }, {});
      }
    } catch (error) {
      console.error("Error fetching all comic likes:", error);
    }
    return {};
  };

  // ✅ Fetch user liked comics
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
    getUserLikes();
    getAllComics();
  }, [userId]);

  const favouriteComics = comics.filter((comic) =>
    likedComics.includes(comic._id)
  );

  if (!userId) {
    return (
      <div className="flex flex-col items-center  h-screen bg-[#123] text-gray-200">
        <div onClick={() => navigate(-1)} className="sticky top-0 left-0 w-full h-[40px] z-20 text-white flex items-center cursor-pointer backdrop-blur-2xl">
            <ChevronLeft />
            Back
        </div>

        <div className="flex-1 px-10 flex items-center justify-center flex-col">
            <img src="/results.svg" alt="" className="" />
            <p className="text-lg font-medium text-center">
            You don’t have any liked comics yet...
            </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#123] py-10 px-5 md:px-10">
        <div onClick={() => navigate(-1)} className="sticky top-0 left-0 h-[40px] z-20 text-white flex items-center cursor-pointer backdrop-blur-2xl">
            <ChevronLeft />
            Back
        </div>
      <h1 className="text-3xl font-bold text-gray-300 mb-8 text-center">
        ❤️ Your Favourite Comics
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : favouriteComics.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <HeartCrack size={50} className="mb-3 text-red-400" />
          <p className="text-lg font-medium">No favourite comics yet...</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favouriteComics.map((comic) => (
            <Link
              to={`/comic_detail/${comic._id}`}
              key={comic._id}
              className="group bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="relative w-full h-60 overflow-hidden">
                <img
                  src={comic.coverImage}
                  alt={comic.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-2 bg-[#20303f]">
                <h2 className="text-xl font-semibold text-gray-100 truncate">
                  {comic.name}
                </h2>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {comic.description}
                </p>
                <div className="flex items-center justify-between text-sm mt-3 text-gray-200">
                  <span>👤 {comic.author?.name || "Unknown"}</span>
                  <span>❤️ {comic.likeCount || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
