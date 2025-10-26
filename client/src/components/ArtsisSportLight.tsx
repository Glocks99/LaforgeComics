import { useEffect, useState } from "react";
import { Twitter, Instagram, Linkedin, X } from "lucide-react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

type Work = {
  artist: string;
  comic: {
    name: string;
    coverImage: string;
    tags: string[];
    description: string;
  };
};

type artistData = {
  _id: string;
  name: string;
  image: string;
  coverImage?: string;
  bio: string;
  socialLinks: {
    twitter: string;
    instagram: string;
    linkedin: string;
  };
};

const ArtistSpotlight = () => {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [artist, setArtist] = useState<artistData | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {darkMode} = useAppContext()

  const getArtist = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/artist/random`);
      if (data.success) setArtist(data.msg);
    } catch (error: any) {
      console.error("Error fetching artist:", error.message);
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const getWorks = async (artistId: string) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/works?artistId=${artistId}&limit=4`
      );
      setWorks(data);
    } catch (error: any) {
      console.error("Error fetching artist:", error.message);
    }
  };

  useEffect(() => {
    getArtist();
  }, []);

  useEffect(() => {
    if (artist?._id) {
      getWorks(artist._id);
    }
  }, [artist]);

  return (
    <section className={`${darkMode ? "bg-white" : "bg-gradient-to-tr from-[#111827]/80 to-[#1f2937]/80 border-t border-white/10"} mt-16 relative px-[16px] sm:px-[40px] py-12 rounded-t-3xl backdrop-blur-xl shadow-xl`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-3xl sm:text-4xl font-extrabold ${darkMode ? "text-gray-800" : "text-white"} mb-10 text-center px-6 py-2 rounded-xl`}>
          🎨 Artist Spotlight
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* 🎧 LEFT SIDE — Spotify-style Artist Card */}
          <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-xl border border-white/10 group">
            {isLoading ? (
              <Skeleton
                height={420}
                baseColor="rgba(255,255,255,0.08)"
                highlightColor="rgba(255,255,255,0.15)"
              />
            ) : (
              <>
                {/* Background */}
                <img
                  src={artist?.coverImage || "/comicPlaceholder.png"}
                  alt={artist?.name}
                  className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-100 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90" />

                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 flex items-end gap-6">
                  {/* Avatar */}
                  <img
                    src={artist?.image || "/comicPlaceholder.png"}
                    alt={artist?.name}
                    className="hidden sm:block w-full h-32 object-cover border-1 border-white/10 shadow-lg"
                  />

                  {/* Info */}
                  <div className="w-full">
                    <h3 className="text-3xl font-bold text-white drop-shadow-lg mb-1">
                      {artist?.name}
                    </h3>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {artist?.bio}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-3 mt-4">
                      <a
                        href={artist?.socialLinks.twitter || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full bg-white/10 border border-white/20 text-blue-400 hover:scale-110 hover:bg-white/20 transition"
                      >
                        <Twitter size={18} />
                      </a>
                      <a
                        href={artist?.socialLinks.instagram || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full bg-white/10 border border-white/20 text-pink-400 hover:scale-110 hover:bg-white/20 transition"
                      >
                        <Instagram size={18} />
                      </a>
                      <a
                        href={artist?.socialLinks.linkedin || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full bg-white/10 border border-white/20 text-blue-500 hover:scale-110 hover:bg-white/20 transition"
                      >
                        <Linkedin size={18} />
                      </a>
                    </div>

                    {/* View Profile */}
                    <Link
                      to={`/artist/${artist?._id}`}
                      className="inline-block mt-5 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 border border-white/20 rounded-lg px-3 py-1 backdrop-blur-sm hover:scale-105 transition"
                    >
                      View Full Profile →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 🎨 RIGHT SIDE — Works (Same as Before) */}
          <div className="flex flex-col gap-4 mt-6 overflow-hidden">
            <h4 className="text-yellow-300 text-lg tracking-wide font-semibold">
              Featured Works
            </h4>
            <p className="text-xs text-gray-400">Swipe to explore featured works →</p>

            {isLoading ? (
              <div className="flex gap-6 overflow-x-auto">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      width={260}
                      height={320}
                      baseColor="rgba(255,255,255,0.1)"
                      highlightColor="rgba(255,255,255,0.2)"
                      className="rounded-2xl flex-shrink-0"
                    />
                  ))}
              </div>
            ) : works && works.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-yellow-500/40 scrollbar-track-transparent">
                {works.map((work, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedWork(work)}
                    className="relative flex-shrink-0 w-64 sm:w-72 h-80 rounded-2xl overflow-hidden snap-center cursor-pointer group"
                  >
                    <img
                      src={work.comic?.coverImage || "/comicPlaceholder.png"}
                      alt={work.comic?.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition"></div>
                    <div className="absolute bottom-0 p-4">
                      <h3 className="text-white font-semibold text-lg drop-shadow-md">
                        {work.comic?.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 text-yellow-200 text-xs">
                        {work.comic?.tags.map((tag) => (
                          <span key={tag}>{tag} •</span>
                        ))}
                      </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 blur-2xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <img src="./work.svg" className="sm:h-[300px]"  alt="" />
                <p className="text-gray-400 text-sm">No works available.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedWork && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden relative w-[90%] max-w-xl shadow-2xl">
            <button
              className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gray-200 hover:text-red-400 hover:scale-110 transition"
              onClick={() => setSelectedWork(null)}
            >
              <X size={22} />
            </button>
            <img
              src={selectedWork.comic.coverImage || "/comicPlaceholder.png"}
              alt={selectedWork.comic.name}
              className="w-full h-96 object-cover"
            />
            <div className="p-6">
              <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                {selectedWork.comic.name}
              </h4>
              <p className="text-gray-200 text-sm leading-relaxed">
                Dive deep into <strong>{selectedWork.comic.name}</strong> and explore
                the imagination of {artist?.name}.
              </p>
              <p className="text-xs text-green-400 border w-fit px-2.5 rounded-full my-2.5">summary</p>
              <p className="text-white text-sm italic">
                {selectedWork.comic.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ArtistSpotlight;
