import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

export type carouselType = {
  _id: string;
  logo: string;
  contentRated: string;
  isDubbed: boolean;
  comic: {
    _id: string;
    name: string;
    description: string;
    tags: string[];
    author: {
      name: string;
    }
    genre: {
      name: string;
    }
    createdAt: string;
    coverImage: string;
  }
};

const Carousel = ({ isHovered }: { isHovered: boolean }) => {
  const { setIsLoading, isLoading } = useAppContext();
  const [carouselData, setCarouselData] = useState<carouselType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  useEffect(() => {
    if (carouselData.length === 0 || isHovered) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselData.length);
    }, 3000);

    return () => clearInterval(intervalRef.current!);
  }, [carouselData.length, isHovered]);

  useEffect(() => {
    getCarousel();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? carouselData.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselData.length);
  };

  if (isLoading || carouselData.length === 0) {
    return (
      <div className="relative w-full h-full flex flex-col animate-pulse text-white px-4 sm:px-10">
        <div className="absolute top-0 left-0 w-full sm:w-[60%] h-full bg-gray-800"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        <div className="relative z-10 h-full w-full flex flex-col justify-end gap-4 pb-6">
          <div className="w-full h-[100px] bg-gray-700 rounded"></div>
          <div className="flex gap-2">
            <div className="h-5 w-24 bg-gray-700 rounded"></div>
            <div className="h-5 w-16 bg-gray-700 rounded"></div>
            <div className="h-5 w-12 bg-gray-700 rounded"></div>
          </div>
          <div className="h-5 w-1/2 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const current = carouselData[currentIndex];

  return (
    <>
      {/* Background (raw cover image) */}
      <div
        className="absolute top-0 left-0 w-full h-full z-0 transition-all duration-700 
             bg-repeat bg-top bg-contain sm:bg-top sm:bg-cover"
        style={{
          backgroundImage: `url(${current.comic?.coverImage || "/comicPlaceholder.png"})`,
        }}
      ></div>

      <div className="absolute inset-0 backdrop-blur-none  sm:backdrop-blur-2xl  to-transparent z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black  to-transparent z-10"></div>

      {/* Content */}
      <div className="relative z-10 h-full w-full text-white flex gap-2.5 px-4 sm:px-10">
        <div className="hidden sm:block flex-1">
          <img src={current.comic?.coverImage} className="object-contain h-full" alt="" />
        </div>
        <div className="w-full flex-1 flex flex-col justify-end sm:justify-center sm:pb-6 gap-4">
          {/* Logo */}
          <div className="w-full h-[100px] flex items-center justify-center sm:justify-end">
            <div className="backdrop-blur-none sm:backdrop-blur-md bg-white/5 p-3 rounded-xl border border-white/10 shadow-lg">
              <img
                src={current.logo}
                className="h-[70px] object-contain"
                alt={current.comic?.name}
              />
            </div>


          </div>

          {/* Info */}
          <div className="flex items-center justify-center sm:justify-end text-sm gap-1">
            <div className="backdrop-blur-md bg-white/10 text-white px-2 py-1 rounded-lg border border-white/10">
              {current.contentRated}
            </div>
            <Dot className="text-gray-400" />
            <p className="backdrop-blur-md bg-white/5 px-2 py-1 rounded-lg border border-white/5 text-gray-200">
              {current.comic?.tags.join(", ")}
            </p>
            <Dot className="text-gray-400" />
            <p className="backdrop-blur-md bg-white/5 px-2 py-1 rounded-lg border border-white/5 text-gray-200">
              {current.isDubbed ? "Dubbed" : "Subbed"}
            </p>
          </div>

          {/* Description */}
          <div className="flex justify-center sm:justify-end sm:h-[100px] overflow-hidden">
            <p className="text-sm sm:text-lg text-gray-200 text-center sm:text-right backdrop-blur-md bg-white/5 border border-white/10 p-3 rounded-xl shadow-md">
              {current.comic?.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center sm:justify-end gap-5">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="backdrop-blur-md bg-white/10 p-2 rounded-full border border-white/10 hover:bg-white/20 transition"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNext}
                className="backdrop-blur-md bg-white/10 p-2 rounded-full border border-white/10 hover:bg-white/20 transition"
              >
                <ChevronRight />
              </button>
            </div>
            <Link to={"/comic_detail/" + current.comic?._id} className="flex items-center gap-1 backdrop-blur-md bg-white/10 py-2 px-4 rounded-lg border border-white/10 hover:bg-white/20 transition">
              Read more <ChevronRight />
            </Link>
          </div>

          {/* Dots */}
          <div className="flex justify-center sm:justify-end">
            <div className="flex gap-2 mt-3">
              {carouselData.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 w-3 rounded-full cursor-pointer transition ${
                    index === currentIndex
                      ? "bg-white backdrop-blur-md"
                      : "bg-white/30 backdrop-blur-sm"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="hidden sm:flex items-center gap-2 mt-4 justify-end">
            {carouselData.map((item, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-[100px] w-[80px] cursor-pointer rounded-lg border ${
                  currentIndex === index
                    ? "border-white/60"
                    : "border-white/10"
                } backdrop-blur-md bg-white/10`}
                style={{
                  background: `url(${item.comic?.coverImage}) center/cover no-repeat`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
