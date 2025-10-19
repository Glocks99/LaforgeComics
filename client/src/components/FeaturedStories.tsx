import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const FeaturedStories = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const comics = [
    {
      id: 1,
      title: "Blazing Shadows",
      genres: "Action • Thriller",
      cover: assets.vid1,
    },
    {
      id: 2,
      title: "The Lost Realms",
      genres: "Fantasy • Epic",
      cover: assets.vid2,
    },
    {
      id: 3,
      title: "Neon Skies",
      genres: "Sci-Fi • Cyberpunk",
      cover: assets.vid3,
    },
  ];

  return (
    <div className="relative bg-gradient-to-b from-black via-[#123] to-[#234] overflow-hidden">
      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10"></div>

      <div className="absolute -bottom-1 z-30 left-0 right-0 h-20 bg-gradient-to-t from-[#234] to-transparent"></div>

      <div
        className="py-16 relative z-20"
        style={{
          background: `url(${assets.lines}) center/cover no-repeat`,
        }}
      >
        <h1
          className="text-gray-100 text-2xl sm:text-5xl font-extrabold text-center mb-12"
          data-aos="fade-down"
        >
          Dive Into Worlds Beyond Imagination
        </h1>

        {/* Stacked Cards with Hover Scale */}
        <div
          className="flex justify-center items-center relative min-h-[350px]"
          data-aos="fade-up"
        >
          {comics.map((comic, idx) => (
            <div
              key={comic.id}
              className={`absolute transition-transform duration-500 rounded-2xl shadow-2xl border-2 ${
                idx === 1
                  ? "z-20 scale-110 hover:scale-115"
                  : "z-10 scale-90 hover:scale-100 opacity-80"
              } ${idx === 0 ? "-translate-x-[160px] rotate-[-8deg]" : ""} ${
                idx === 2 ? "translate-x-[160px] rotate-[8deg]" : ""
              }`}
              style={{
                width: "260px",
                height: "380px",
                background: `url(${comic.cover}) center/cover no-repeat`,
              }}
            >
              <div className="h-full w-full flex flex-col justify-end p-4 rounded-2xl bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-lg sm:text-xl font-bold text-gray-100">
                  {comic.title}
                </h3>
                <p className="text-sm text-gray-300">{comic.genres}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description Section */}
        <div
          className="mt-24 max-w-3xl mx-auto text-center px-4"
          data-aos="fade-up"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-4">
            Discover Stories Curated for You
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Every comic featured here brings you closer to a universe full of
            breathtaking adventures, timeless heroes, and unforgettable moments.
            Join thousands of readers discovering handpicked tales from around
            the world, updated every week just for you.
          </p>
          <Link
            to={"/feed"}
            className="inline-block mt-6 text-blue-500 font-medium hover:underline"
          >
            Start Exploring →
          </Link>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black to-transparent z-10"></div> */}
    </div>
  );
};

export default FeaturedStories;