import {
  Menu,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  X,
  Loader,
  PenToolIcon,
  HeartPlus,
  CircleQuestionMark,
  ChevronRight,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {faqData} from "../pages/Settings"
import Modal from "./Modal";

type Comic = {
  _id: string;
  name: string;
  coverImage: string;
  description: string;
  author: {
    name: string;
  };
  avgRating: number;
  total: number;
};

const Header = () => {
  const navigate = useNavigate();
  const {
    user,
    logout,
    isMenuOpen,
    setIsMenuOpen,
    setDarkMode,
    darkMode,
  } = useAppContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [comics, setComics] = useState<Comic[]>([]);
  const [_, setIsLoading] = useState(false)
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleSearch = async () => {
    if (searchItem.trim() === "") {
      toast.error("Please enter something to search");
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    setComics([]);

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/comics?search=${searchItem}`
      );

      if (data.success && Array.isArray(data.msg)) {
        setComics(data.msg);
        toast.success(`Found ${data.msg.length} comic(s)!`);
      } else {
        toast.error(data.msg || "No comics found");
      }
    } catch (error: any) {
      toast.error("Search failed");
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setIsSearching(false);
        setIsLoading(false);
      }, 800);
    }
  };

  return (
    <header className={`${darkMode ? "bg-white text-gray-600" : "bg-[#1a1f2b] text-white"} shadow-md sticky top-0 z-60`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-10 py-4 border-b border-[#32485e]">
        {/* Left: User Profile / Login */}
        <div className="flex items-center gap-4">
          {user.isLoggedIn ? (
            <div className="relative group hidden sm:flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full font-bold text-black cursor-pointer transition-shadow duration-300 hover:shadow-lg hover:shadow-blue-500/50">
              {user.user?.firstName.slice(0, 2)}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-600 border-2 border-[#1a1f2b]" />

              {/* Dropdown */}
              <div className="hidden group-hover:flex font-normal text-white flex-col absolute top-[10%] left-[110%] bg-[#1a1f2b] border border-[#32485e] rounded-lg shadow-xl w-52 overflow-hidden animate-fade-in-up">
                <div className="px-4 py-3 border-b border-[#32485e] text-sm font-semibold text-yellow-400">
                  Hello, {user.user?.firstName}
                </div>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#2c3648] transition w-full text-left text-sm"
                >
                  <User size={18} /> Profile
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#2c3648] transition w-full text-left text-sm"
                >
                  <Settings size={18} /> Settings
                </button>
                <button
                  onClick={() => navigate("/likes")}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#2c3648] transition w-full text-left text-sm"
                >
                  <HeartPlus size={18} /> favourites
                </button>
                <button
                  onClick={() => setIsFaqOpen(true)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#2c3648] transition w-full text-left text-sm relative"
                >
                  <CircleQuestionMark size={18} /> FAQ
                 
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-red-600 transition w-full text-left text-sm text-red-400"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#2c3648] hover:bg-[#3c4f65] transition"
            >
              <User size={18} /> <span className="text-sm">Login / Signup</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="block sm:hidden p-2 rounded bg-[#2c3648] hover:bg-[#3c4f65] transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
        </div>

        {/* Center: Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo}
            alt="LaForge Logo"
            className="h-10 w-10 object-contain drop-shadow"
          />
          <p className="font-bold text-2xl sm:text-4xl tracking-wide">
            LaForge
          </p>
        </div>

        {/* Right: Dark Mode & Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="hover:text-yellow-400 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div
            onClick={() => setIsSearchOpen(true)}
            className={`flex h-8 w-8 cursor-pointer hover:bg-white/10 items-center justify-center border border-[#3c4f65] rounded-full`}
          >
            <Search size={16} />
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 overflow-hidden backdrop-blur-xl z-50 flex flex-col items-center p-4 gap-1.5 text-white bg-black/60">
          <div
            onClick={() => {
              setIsSearchOpen(false)
              setComics([])
            }}
            className="flex items-center justify-end w-full cursor-pointer hover:text-red-500"
          >
            <X />
          </div>

          <div className="w-full flex items-center rounded-full sm:w-[50%] border border-white/10 p-0.5 bg-white/5">
            <input
              onChange={(e) => setSearchItem(e.target.value)}
              type="text"
              placeholder="Search comic..."
              className="h-[40px] outline-0 w-full pl-2 bg-transparent text-white placeholder:text-gray-400"
            />
            <button
              onClick={() => handleSearch()}
              className="bg-white/10 w-[100px] h-full flex items-center justify-center rounded-full cursor-pointer hover:bg-yellow-400/30 transition"
            >
              <Search size={16} />
            </button>
          </div>

          <div className="flex items-center justify-center w-full h-full [scrollbar-width:none]">
            {isSearching ? (
              <div className="flex flex-col items-center gap-1.5">
                <Loader className="animate-spin" />
                <p>Searching...</p>
              </div>
            ) : comics.length === 0 ? (
              <div className="flex flex-col items-center gap-1 opacity-75">
                <img src="/search.svg" alt="" className="h-[200px] w-[200px]" />
                <p>Search for comic...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full overflow-hidden h-full">
                <div className="text-xs font-medium text-white/40">
                  Found ({comics.length}) comics
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 p-4 w-full h-full overflow-y-auto">
                  {comics.map((comic, index) => (
                    <div
                      key={index}
                      className="group relative w-full sm:w-[200px] h-[320px] sm:h-fit rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:shadow-yellow-400/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03]"
                    >
                      {/* Comic Cover */}
                      <div
                        onClick={() => navigate(`/comic_detail/${comic._id}`)}
                        className="h-[220px] w-full bg-center bg-cover relative"
                        style={{ backgroundImage: `url(${comic.coverImage})` }}
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

                        {/* Comic title */}
                        <h3 className="absolute bottom-4 left-3 right-3 text-white font-bold text-sm sm:text-base truncate group-hover:text-yellow-400 transition-colors">
                          {comic.name}
                        </h3>
                      </div>

                      {/* Info Section */}
                      <div className="p-3 flex flex-col gap-1">
                        <p className="text-xs text-gray-400 flex items-center gap-1.5"><PenToolIcon size={16} /> {comic.author.name}</p>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              fill={i < Math.round(comic.avgRating || 0) ? "currentColor" : "none"}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className={`h-4 w-4 ${
                                i < Math.round(comic.avgRating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-600"
                              }`}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.916c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.89a1 1 0 00-1.175 0l-3.977 2.89c-.784.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.977-2.89c-.784-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.518-4.674z"
                              />
                            </svg>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                          <span className="bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                            {comic.avgRating.toFixed(1)} ★
                          </span>
                          <span className="italic">{comic.total} Reviews</span>
                        </div>
                      </div>

                      {/* Hover Shine Effect */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-700">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-yellow-400/20 to-transparent blur-md animate-[shine_2s_ease-in-out_infinite]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className={`${darkMode ? "bg-white text-gray-800" : "bg-[#1a1f2b]"} border-t border-[#32485e] py-3`}>
        <ul className="flex items-center justify-center gap-8 text-sm sm:text-base">
          {["Blogs", "Comics", "Feed", "More"].map((item, idx) => (
            <li
              key={idx}
              onClick={() => navigate(`/${item.toLowerCase()}`)}
              className="relative group cursor-pointer transition hover:text-yellow-400"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </li>
          ))}
        </ul>
      </nav>

      {/* FAQ Modal (Collapsible) */}
        <Modal
          isOpen={isFaqOpen}
          onClose={() => setIsFaqOpen(false)}
          title="Frequently asked questions"
        >
          <div className="text-white">
            {faqData.map((faq, index) => (
              <div key={index} className="border-b border-white/10 py-1.5 mt-2">
                <p
                  className="font-bold cursor-pointer flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${
                      openFAQ === index ? "rotate-90" : ""
                    }`}
                  />
                </p>
                {openFAQ === index && (
                  <p className="bg-white/10 p-1 rounded-lg text-sm mt-1 transition-all duration-300">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Modal>
    </header>
  );
};

export default Header;
