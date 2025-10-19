import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Twitter,
  Instagram,
  Facebook,
  ChevronLeft,
  Play,
  Share2,
} from "lucide-react";

type ArtistDetailProps = {
  _id: string;
  name: string;
  image: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  coverImage: string;
};

type Work = {
  artist: string;
  comic: {
    _id: string;
    name: string;
    coverImage: string;
    episodes: string[];
  };
};

const Artist: React.FC = () => {
  const { isLoading, setIsLoading } = useAppContext();
  const [artist, setArtist] = useState<ArtistDetailProps | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const { id } = useParams();

  const navigate = useNavigate()

  const getArtistData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/artist/${id}`);
      if (data.success) setArtist(data.msg);
    } catch (error: any) {
      toast.error(error.message || "Failed to load artist");
    } finally {
      setTimeout(() => setIsLoading(false), 1200);
    }
  };

  const getWorks = async (artistId: string) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/works?artistId=${artistId}`
      );
      setWorks(data);
    } catch (error: any) {
      console.error("Error fetching works:", error.message);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getArtistData();
  }, []);

  useEffect(() => {
    if (artist?._id) getWorks(artist._id);
  }, [artist]);

  return (
    <div className="relative flex flex-col w-full h-screen bg-[#0a0a0a] text-white overflow-y-auto scrollbar-hide">
      {/* Top background image */}
      <div className="relative h-[50vh] w-full">
        {isLoading ? (
          <Skeleton height="100%" baseColor="#1c1c1c" highlightColor="#333" />
        ) : (
          <>
            <img
              src={artist?.image || "/comicPlaceholder.png"}
              className="w-full h-full object-cover brightness-75"
              alt={artist?.name}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-[#0a0a0a]" />

            {/* Back button */}
            <div
              onClick={() => window.history.back()}
              className="absolute top-5 left-5 cursor-pointer flex items-center gap-1 text-sm text-gray-300 hover:text-white"
            >
              <ChevronLeft /> Back
            </div>

            {/* Artist Info Overlay */}
            <div className="absolute bottom-6 left-6 flex items-end gap-6">
              <img
                src={artist?.coverImage || "/comicPlaceholder.png"}
                alt={artist?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/10 shadow-xl"
              />
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-1">
                  {artist?.name || "Loading..."}
                </h1>
                <p className="text-gray-300 text-sm">Featured Artist</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky header when scrolling */}
      <div className="sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-20 flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/comic_detail/${works[0].comic._id}`)}  className="bg-green-500 hover:bg-green-600 transition rounded-full p-2">
            <Play className="text-black" size={20} />
          </button>
          {/* <button className="border border-white/20 px-4 py-1.5 rounded-full text-sm hover:bg-white/10 transition">
            Follow
          </button> */}
        </div>
        <div className="flex items-center gap-4">
          {artist?.socialLinks?.twitter && (
            <a href={artist.socialLinks.twitter} target="_blank" rel="noreferrer">
              <Twitter className="hover:text-green-400 transition" size={18} />
            </a>
          )}
          {artist?.socialLinks?.instagram && (
            <a
              href={artist.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="hover:text-pink-500 transition" size={18} />
            </a>
          )}
          {artist?.socialLinks?.facebook && (
            <a
              href={artist.socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
            >
              <Facebook className="hover:text-blue-500 transition" size={18} />
            </a>
          )}
          <Share2 className="cursor-pointer hover:text-gray-300 transition" size={18} />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-10 space-y-14">
        {/* Popular Works */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Popular Works</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    height={160}
                    baseColor="#1c1c1c"
                    highlightColor="#333"
                    className="rounded-lg"
                  />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
              {works.map((work, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/comic_detail/${work.comic._id}`)}
                  className="group cursor-pointer hover:scale-[1.05] transition-transform relative"
                >
                  <div className="absolute top-0 bg-green-400 text-white z-10 text-sm px-1">{work.comic.episodes.length} Episodes</div>
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={work.comic.coverImage || "/comicPlaceholder.png"}
                      alt={work.comic.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Play size={26} className="text-white" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium">{work.comic.name}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* About Section */}
        <section>
          <h2 className="text-2xl font-bold mb-3">About</h2>
          <p className="text-gray-300 leading-relaxed">
            {isLoading ? (
              <Skeleton count={5} baseColor="#1c1c1c" highlightColor="#333" />
            ) : (
              artist?.bio || "No biography available for this artist."
            )}
          </p>
        </section>
      </div>
    </div>
  );
};

export default Artist;
