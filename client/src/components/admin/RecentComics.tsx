import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const SkeletonComicCard = () => (
  <li className="flex gap-4 bg-gray-50 p-3 rounded-lg border border-transparent animate-pulse">
    <div className="w-[80px] h-[110px] bg-gray-200 rounded-md"></div>
    <div className="flex-1 space-y-2 py-1">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-2 bg-gray-200 rounded w-1/3"></div>
    </div>
  </li>
);

type Comic = {
  name: string;
  author: {
    name: string
  };
  createdAt: string;
  genre: {
    name: string;
  };
  coverImage: string;
  description: string;
};



const RecentComics = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call

    const fetchComics = async() => {
      try {
        const {data} = await axios.get(`${import.meta.env.VITE_BackendURL}/api/comics/popComics`)

        if(data.success){
          setComics(data.msg)
          setLoading(false)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message)
      }
    }
    fetchComics()
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <CalendarDays className="text-indigo-600" size={22} />
        Recent Comics
      </h2>

      <ul className="grid gap-5 md:grid-cols-2">
        {loading || comics.length === 0
          ? Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonComicCard key={idx} />
            ))
          : comics.map((comic, idx) => (
              <li
                key={idx}
                className="flex gap-4 bg-gray-50 hover:bg-white transition p-3 rounded-lg border border-transparent hover:border-gray-300"
              >
                <img
                  src={comic.coverImage}
                  alt={comic.name}
                  className="w-[80px] h-[110px] object-cover rounded-md shadow"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold text-gray-800 line-clamp-1">
                      {comic.name}
                    </h3>
                    <span className="text-xs px-2 rounded-full text-white bg-gray-500 text-nowrap">{comic.genre.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Author:</span> {comic.author?.name}
                  </p>
                  <p className="text-sm text-gray-500 italic line-clamp-2">
                    {comic.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(comic.createdAt).toDateString()}
                  </p>
                </div>
              </li>
            ))}
      </ul>

      {!loading && (
        <div className="mt-6 text-right">
          <Link to={"/admin/comics"} className="text-sm text-indigo-600 hover:underline hover:text-indigo-800 transition">
            View All Comics →
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentComics;
