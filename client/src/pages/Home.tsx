import Carousel from "../components/Carousel";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";
import BrowseByGenre from "../components/BrowseByGenre";
import LatestUpdates from "../components/LatestUpdates";
import ArtistSpotlight from "../components/ArtsisSportLight";
import TopRatedComics from "../components/TopRatedComics";
import SponsorsCarousel from "../components/SponsorsCarousel";
import AboutCreator from "../components/AboutCreator";
import FeaturedStories from "../components/FeaturedStories";
import Footer from "../components/Footer";

const Home = () => {
  const { isLoading, darkMode } = useAppContext();
  const [showLoader, setShowLoader] = useState(false);
  const [_, setIsHovered] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
    } else if (showLoader) {
      // Wait for the fade-out animation before unmounting
      const timer = setTimeout(() => setShowLoader(false), 1000); // 500ms matches CSS duration
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className={`${darkMode ? "bg-white" : "bg-[#234]"}`}>
      <SideBar />
      <Header />
      <div
        className="relative h-[calc(100vh-120px)] w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showLoader && (
          <div
            className={`z-50 absolute inset-0 flex flex-col items-center justify-center h-[calc(100vh-120px)]
            transition-opacity duration-500
            ${isLoading ? "opacity-100" : "opacity-0"}`}
          >
            <LoaderIcon color="white" className="animate-spin" />
            <p className="text-white">Loading...</p>
          </div>
        )}
        <Carousel isHovered={true} />
      </div>

      <FeaturedStories />

      {/* Browse by genre */}
      <BrowseByGenre />

      {/* Latest updates */}
      <LatestUpdates />

      {/* Artists work*/}
      <ArtistSpotlight />

      {/* Top Rated */}
      <TopRatedComics />

      {/* Sponsors */}
      <SponsorsCarousel />

      {/* creator */}
      <AboutCreator />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
