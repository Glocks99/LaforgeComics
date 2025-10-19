import { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import type { carouselType } from "./Carousel";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

const MenuCarousel = () => {
  const { setIsLoading } = useAppContext();
  const [carouselData, setCarouselData] = useState<carouselType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getCarousel = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/carousel`);
      setCarouselData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % carouselData.length);

  const handlePrevious = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? carouselData.length - 1 : prev - 1
    );

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(handleNext, AUTO_SLIDE_INTERVAL);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, carouselData]);

  useEffect(() => {
    getCarousel();
  }, []);

  if (carouselData.length === 0) return null;
  const current = carouselData[currentIndex];

  return (
    <section
      className="relative h-[calc(100vh-100px)] w-full flex items-center justify-center bg-black overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div
        key={current._id}
        className="absolute inset-0 transition-all duration-[1200ms] ease-in-out"
        style={{
          backgroundImage: `url(${current.comic.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4)",
        }}
      ></div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/60 to-transparent mix-blend-overlay z-10 animate-pulse-slow"></div>

      {/* Floating glow effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[160px]" />
      </div>

      {/* Carousel Info Card */}
      <div className="relative z-20 max-w-5xl w-full px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-10">
        {/* Comic Logo */}
        <div className="flex-1 flex flex-col items-start">
          <p className="px-4 py-1 text-xs uppercase tracking-wide bg-white/10 border border-white/20 rounded-full text-white/90 mb-4 backdrop-blur-sm">
            Featured Comic
          </p>

          <div className="w-full h-[100px] sm:h-[120px] relative mb-6">
            <img
              src={current.logo}
              alt={current.comic.name}
              className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
            />
          </div>

          <p className="text-white/80 text-sm sm:text-base mb-6 leading-relaxed">
            {current.comic.description ||
              "Immerse yourself in the stunning visuals and storytelling of this latest release. Experience the power, the mystery, and the magic."}
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-xs text-white/90 bg-white/10 border border-white/20 backdrop-blur-md">
              Genre: {current.comic.genre?.name || "N/A"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs text-white/90 bg-white/10 border border-white/20 backdrop-blur-md">
              Author: {current.comic.author?.name?.toUpperCase() || "Unknown"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs text-white/90 bg-white/10 border border-white/20 backdrop-blur-md">
              Released: {current.comic.createdAt?.slice(0, 4) || "----"}
            </span>
          </div>
        </div>

        {/* Cover Preview */}
        <div className="hidden relative flex-1 sm:flex justify-center items-center group">
          <img
            src={current.comic.coverImage}
            alt={current.comic.name}
            className="rounded-3xl w-[280px] sm:w-[400px] lg:w-[460px] h-[400px] sm:h-[520px] object-cover shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition"></div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {isHovered && (
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-6 z-30">
          <button
            onClick={handlePrevious}
            className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md transition"
            aria-label="Previous"
          >
            <ChevronLeft className="text-white h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md transition"
            aria-label="Next"
          >
            <ChevronRight className="text-white h-6 w-6" />
          </button>
        </div>
      )}

      {/* Indicator Dots */}
      <div className="absolute bottom-6 z-20 flex gap-3">
        {carouselData.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-yellow-400 shadow-[0_0_10px_rgba(255,255,0,0.6)] scale-125"
                : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default MenuCarousel;
