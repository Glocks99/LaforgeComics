import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Skeleton from "react-loading-skeleton";
import {
  Cat,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Facebook,
  Home,
  IdCardLanyard,
  Instagram,
  Library,
  MessageSquare,
  SendHorizonal,
  Share2,
  Twitter,
  X,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CommentsSection from "../components/CommentsSeaction";

type Genre = {
  name: string;
  description?: string;
};

type Comics = {
  _id: string;
  name: string;
  episodes?: string[];
  views?: number;
  isPublished: boolean;
  author?: {
    name: string;
  };
  description?: string;
  genre?: {
    name?: string;
  };
  coverImage: string;
  tags?: string[];
  likeCount?: number;
};

interface CommentCountResponse {
  success: boolean;
  comicId: string;
  totalComments: number;
}

const FeedDetail = () => {
  const { isLoading, setIsLoading, user, logout } = useAppContext();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [, setGenre] = useState<String[]>(["All"]);
  const [filteredComics, setFilteredComics] = useState<Comics[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeComicId, setActiveComicId] = useState<string | null>(null);
  const [allComics, setAllComics] = useState<Comics[]>([]);
  const [likedComics, setLikedComics] = useState<string[]>([]);

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId =
    user?.user?.id || parsedUser?._id || parsedUser?.id || null;

  // Infinite scroll states
  const [, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getGenres = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/genres`);
      if (data.success) {
        const names = data.msg.map((g: Genre) => g.name);
        setGenre((prev) => [...prev, ...names]);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

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
  if (!searchTerm.trim()) {
    setFilteredComics(allComics);
  } else {
    const term = searchTerm.toLowerCase();
    setFilteredComics(
      allComics.filter(
        (comic) =>
          comic.name.toLowerCase().includes(term) ||
          comic.description?.toLowerCase().includes(term) ||
          comic.genre?.name?.toLowerCase().includes(term)
      )
    );
  }
}, [searchTerm, allComics]);


  useEffect(() => {
    setIsLoading(true);
    getGenres();
    getComics(1); // load first comics
    getUserLikes();
  }, []);


  const observer = useRef<IntersectionObserver>(null);

  // Fetch comics with pagination
  const getComics = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/comics?page=${pageNum}&limit=5`
      );

      if (data.success) {
        const comics = data.msg;

        const updatedComics = await Promise.all(
          comics.map(async (comic: any) => {
            const likeCount = await getComicsLikes(comic._id);
            const commentsData = await axios.get(
              `${import.meta.env.VITE_BackendURL}/api/comments/${comic._id}/total`
            );
            const total = commentsData.data?.totalComments || 0;
            setTotalComments((prev) => ({ ...prev, [comic._id]: total }));
            return { ...comic, likeCount };
          })
        );

        setAllComics((prev) => [...prev, ...updatedComics]);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.log("Error fetching comics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Observe last comic
  const lastComic = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            // getComics(nextPage);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollByCard = (direction: "up" | "down") => {
    if(isCommentsOpen) return;
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardHeight = 500;
    container.scrollBy({
      top: direction === "up" ? -cardHeight : cardHeight,
      behavior: "smooth",
    });
  };

  const handleLike = async (comicId: string) => {
    if (!userId) {
      toast.error("Please login to like comics.");
      return;
    }

    try {
      if (likedComics.includes(comicId)) {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_BackendURL}/api/likes/${comicId}`,
          { data: { userId } }
        );
        if (data.success) {
          setLikedComics((prev) => prev.filter((id) => id !== comicId));
          setAllComics((prev) =>
            prev.map((c) =>
              c._id === comicId
                ? { ...c, likeCount: Math.max(0, (c.likeCount || 1) - 1) }
                : c
            )
          );
        }
      } else {
        const { data } = await axios.post(`${import.meta.env.VITE_BackendURL}/api/likes`, {
          userId,
          comicId,
        });
        if (data.success) {
          setLikedComics((prev) => [...prev, comicId]);
          setAllComics((prev) =>
            prev.map((c) =>
              c._id === comicId
                ? { ...c, likeCount: (c.likeCount || 0) + 1 }
                : c
            )
          );
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleShare = async (comic: Comics) => {
    const url = `${window.location.origin}/comic_detail/${comic._id}`;
    const text = `Check out "${comic.name}" on our comics site!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: comic.name, text, url });
      } catch (err) {
        console.error("Share cancelled", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const getComicsLikes = async (comicId: string) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/likes/comic/${comicId}`
      );
      if (data.success) return data.totalLikes || 0;
    } catch (error) {
      console.error("Error fetching comic likes:", error);
    }
    return 0;
  };

  const [msg, setMsg] = useState("");
  const [text, setText] = useState("");
  const [_, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState<Record<string, number>>({});

  const pushComment = async (comicId: string) => {
    if (!text.trim()) return;
    if (!userId) {
      toast.error("Login to comment!");
      return;
    }
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BackendURL}/api/comments`, {
        userId,
        comicId,
        text,
      });
      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setText("");
        setMsg(text);
        fetchCommentCount(comicId);
        toast.success("Comment added!");
      }
    } catch (error: any) {
      console.error("Error posting comment:", error);
      toast.error(error.message);
    }
  };

  const fetchCommentCount = async (comicId: string) => {
    try {
      const { data } = await axios.get<CommentCountResponse>(
        `${import.meta.env.VITE_BackendURL}/api/comments/${comicId}/total`
      );
      if (data.success) {
        setTotalComments((prev) => ({
          ...prev,
          [comicId]: data.totalComments,
        }));
      }
    } catch (error) {
      console.error("Error fetching comment count:", error);
    }
  };

  return (
    <div className="flex justify-center gap-4 h-screen sm:p-4 overflow-hidden bg-[#2f3e52] text-white">
      {/* Left sidebar */}
      <div className="hidden sm:block w-[250px]">
        <div className="w-full h-full flex flex-col">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={assets.logo}
              alt="LaForge Logo"
              className="h-10 w-10 object-contain drop-shadow"
            />
            <p className="font-bold text-xl sm:text-2xl tracking-wide">
              LaForge
            </p>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto [scrollbar-width:none] mt-4">
            <div className="mb-4">
              {/* search comic */}
              <input
                type="text"
                placeholder="Search comic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 outline-none rounded-full text-sm py-2 pl-2.5 w-full placeholder:text-gray-300"
              />

            </div>

            {isLoading ? (
              Array(8)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="mb-2">
                    <Skeleton
                      height={30}
                      baseColor="#2f3e52"
                      highlightColor="#3f4e65"
                    />
                  </div>
                ))
            ) : (
              <>
                <div onClick={() => navigate("/")} className="flex items-center gap-1 bg-[#1234] py-2 pl-1 rounded-r-full mb-0.5 cursor-pointer"><Home size={16} /> Home</div>
                <div onClick={() => navigate("/blogs")} className="flex items-center gap-1 py-2 bg-[#1234] pl-1 rounded-r-full mb-0.5 cursor-pointer"><Library size={16} /> Blogs</div>
                <div onClick={() => navigate("/comics")} className="flex items-center gap-1 py-2 pl-1 rounded-r-full bg-[#1234] mb-0.5 cursor-pointer"><Cat size={16} /> Comics</div>
                <div onClick={() => navigate("/profile")} className="flex items-center gap-1 cursor-pointer bg-[#1234] py-2 pl-1 rounded-r-full mb-0.5"><IdCardLanyard size={16}/> Profiles</div>
              </>
            )}
          </div>

          <div className="border-t border-white/10 mt-auto">
            {user.isLoggedIn ? 
            (<button onClick={() => logout()} className="text-sm py-2 bg-red-500 rounded hover:bg-red-600 w-full cursor-pointer transition">logout</button>):(
              <div className="flex flex-col gap-2 my-2.5">
                <button className="text-sm py-1 bg-blue-500 rounded hover:bg-blue-600 transition">
                  Login
                </button>
                <button className="border text-sm py-1 border-red-500 text-red-500 rounded hover:bg-red-500/10 transition">
                  Sign up
                </button>
              </div>
            )}
            <div className="text-sm space-y-1 mt-2.5">
              <p>Follow us on</p>
              <div className="flex items-center gap-1.5">
                <span className="bg-[#1234] p-1.5 rounded-full"><Twitter size={16} /></span> • <span className="bg-[#1234] p-1.5 rounded-full"><Facebook size={16} /></span> • <span className="bg-[#1234] p-1.5 rounded-full"><Instagram size={16} /></span>
              </div>
              <p>&copy; {new Date().getFullYear()} LaForge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle scroll section */}
      <div
        ref={scrollContainerRef}
        className={`relative flex flex-col items-center w-full sm:w-fit flex-1 snap-y snap-mandatory transition-all duration-300 [scrollbar-width:none] ${
          isCommentsOpen ? "overflow-hidden" : "overflow-y-scroll"
        }`}
      >
        {filteredComics.map((comic, index) => {
          const isLast = allComics.length === index + 1;

          if(isLast){
            return (
              <div
                key={comic._id}
                ref={lastComic}
                className="relative flex h-full w-full sm:w-[400px] snap-start"
              >
              
                <div className="relative flex flex-col w-full h-screen">
                  {/* Image Section */}
                  <div
                    className={`transition-all duration-300 origin-top-left bg-black w-full overflow-hidden ${
                      isCommentsOpen
                        ? "h-[20%] sm:h-screen"
                        : "h-screen"
                    }`}
                  >
                    <img
                      src={
                        comic.coverImage ||
                        "/assets/carousel-images/cover/Superman-Cover.jpeg"
                      }
                      alt={comic.name}
                      className={`w-full h-full ${
                        isCommentsOpen ? "object-contain sm:object-cover" : "object-cover"
                      }`}
                    />
                  </div>
  
                  {/* Comments Section (mobile only) */}
                  <div
                    className={`flex sm:hidden z-10 flex-col transition-all duration-300 origin-bottom w-full overflow-hidden ${
                      isCommentsOpen
                        ? "h-[80%] opacity-100"
                        : "h-0 opacity-0"
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm p-1 border-b border-white/10">
                      <p>comments({totalComments[comic._id] ?? 0})</p>
                      <button onClick={() => setIsCommentsOpen(!isCommentsOpen)}>
                        <X />
                      </button>
                    </div>
  
                    <div className="flex-1 overflow-y-auto px-2 [scrollbar-width:none]">
                      <CommentsSection comicId={comic._id} msg={msg} />
                    </div>
  
                    
  
                    <div className="h-[50px] px-2 flex items-center gap-1">
                      <div className="bg-amber-800 h-[30px] min-w-[30px] flex items-center justify-center rounded-full">
                        JL
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-white/10 w-full h-[80%] px-1.5">
                        <input
                          type="text"
                          placeholder="Add comment"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="w-full h-full outline-none bg-transparent pl-1.5 text-white text-sm"
                        />
                        <button onClick={() => pushComment(comic._id)}>
                          <SendHorizonal />
                        </button>
                      </div>
                    </div>
                  </div>
  
                  {/* Floating Action Buttons (mobile only) */}
                  {!isCommentsOpen && (
                    <div className="sm:hidden absolute right-2 inset-y-0 flex flex-col justify-center gap-3 z-10">
                      <div
                        onClick={() => handleLike(comic._id)}
                        className="flex flex-col items-center gap-1 rounded-md backdrop-blur-md bg-gradient-to-br from-[#6dc8ff]/20 to-[#5ea9ff]/10 border border-white/10 p-1.5"
                      >
                        {likedComics.includes(comic._id) ? "❤️" : "🤍"}
                        <span className="text-xs font-medium">
                          {comic.likeCount ?? 0}
                        </span>
                      </div>
                      <div
                        onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-md backdrop-blur-md bg-gradient-to-br from-[#6dc8ff]/20 to-[#5ea9ff]/10 border border-white/10"
                      >
                        <MessageSquare className="w-5 h-5 text-sky-300" />
                        <span className="text-xs font-medium">
                          {totalComments[comic._id] ?? 0}
                        </span>
                      </div>
                      <div
                        onClick={() => handleShare(comic)}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-md backdrop-blur-md bg-gradient-to-br from-[#6dc8ff]/20 to-[#5ea9ff]/10 border border-white/10"
                      >
                        <Share2 className="w-5 h-5" />
                      </div>
                    </div>
                  )}
  
                  {/* Comic details overlay */}
                  {!isCommentsOpen && (
                    <div className="absolute bottom-0 sm:bottom-8 left-0 w-full p-2 z-10 flex flex-col justify-end">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-2xl sm:text-sm font-bold line-clamp-1">
                          {comic.name}
                        </span>
                        •
                        <span className="text-sm opacity-70 sm:text-xs">
                          {comic.author?.name || "Unknown"}
                        </span>
                        •
                        <span className="ml-2 sm:text-xs inline-block min-w-fit text-xs px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                          {comic.episodes?.length} Episodes
                        </span>
                      </div>
  
                      <p className="mt-2 sm:mt-1 text-sm sm:text-xs font-light text-white/85 line-clamp-3">
                        {comic.description}
                      </p>
  
                      <div className="flex gap-2 flex-wrap mt-1">
                        {comic.tags?.map((tag) => (
                          <p
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded bg-white/10"
                          >
                            {tag}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none transition-all duration-300"></div>
                </div>
  
                {/* Desktop action buttons */}
                <div className="hidden sm:flex w-[50px] flex-col items-center justify-center p-2">
                  <button
                    onClick={() => handleLike(comic._id)}
                    className="p-2 flex flex-col items-center rounded-full cursor-pointer"
                  >
                    <span className="bg-[#1234] rounded-full h-10 w-10 flex items-center justify-center">
                      {likedComics.includes(comic._id) ? "❤️" : "🤍"}
                    </span>
                    <span className="font-medium text-xs">
                      {comic.likeCount ?? 0}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCommentsOpen(true);
                      setActiveComicId(comic._id);
                    }}
                    className="cursor-pointer"
                  >
                    <span className="bg-[#1234] rounded-full h-10 w-10 flex items-center justify-center">
                      <MessageSquare />
                    </span>
                    <span className="font-medium text-xs">
                      {totalComments[comic._id] ?? 0}
                    </span>
                  </button>
                  <button
                    onClick={() => handleShare(comic)}
                    className="cursor-pointer bg-[#1234] rounded-full h-10 w-10 flex items-center justify-center"
                  >
                    <Share2 />
                  </button>
                </div>
              </div>
            );
          }else{
            return (
              <div
                key={comic._id}
                className="relative flex h-full w-full sm:w-[400px] snap-start"
              >
              
                <div className="relative flex flex-col w-full h-screen">
                  {/* Image Section */}
                  <div
                    className={`transition-all duration-300 origin-top-left bg-black w-full overflow-hidden ${
                      isCommentsOpen
                        ? "h-[20%] sm:h-screen"
                        : "h-screen"
                    }`}
                  >
                    <img
                      src={
                        comic.coverImage ||
                        "/assets/carousel-images/cover/Superman-Cover.jpeg"
                      }
                      alt={comic.name}
                      className={`w-full h-full ${
                        isCommentsOpen ? "object-contain sm:object-cover" : "object-cover"
                      }`}
                    />
                  </div>
  
                  {/* Comments Section (mobile only) */}
                  <div
                    className={`flex sm:hidden z-10 flex-col transition-all duration-300 origin-bottom w-full overflow-hidden ${
                      isCommentsOpen
                        ? "h-[80%] opacity-100"
                        : "h-0 opacity-0"
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm p-1 border-b border-white/10">
                      <p>comments({totalComments[comic._id] ?? 0})</p>
                      <button onClick={() => setIsCommentsOpen(!isCommentsOpen)}>
                        <X />
                      </button>
                    </div>
  
                    <div className="flex-1 overflow-y-auto px-2 [scrollbar-width:none]">
                      <CommentsSection comicId={comic._id} msg={msg} />
                    </div>
  
                    
  
                    <div className="h-[50px] px-2 flex items-center gap-1">
                      <div className="bg-amber-800 h-[30px] min-w-[30px] flex items-center justify-center rounded-full">
                        JL
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-white/10 w-full h-[80%] px-1.5">
                        <input
                          type="text"
                          placeholder="Add comment"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="w-full h-full outline-none bg-transparent pl-1.5 text-white text-sm"
                        />
                        <button onClick={() => pushComment(comic._id)}>
                          <SendHorizonal />
                        </button>
                      </div>
                    </div>
                  </div>
  
                  {/* Floating Action Buttons (mobile only) */}
                  {!isCommentsOpen && (
                    <div className="sm:hidden absolute right-2 inset-y-0 flex flex-col justify-center gap-3 z-10">
                      <div
                        onClick={() => handleLike(comic._id)}
                        className="flex flex-col items-center gap-1 rounded-md backdrop-blur-md bg-gradient-to-br from-[#6dc8ff]/20 to-[#5ea9ff]/10 border border-white/10 p-1.5"
                      >
                        {likedComics.includes(comic._id) ? "❤️" : "🤍"}
                        <span className="text-xs font-medium">
                          {comic.likeCount ?? 0}
                        </span>
                      </div>
                      <div
                        onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-md backdrop-blur-md bg-gradient-to-br from-[#6dc8ff]/20 to-[#5ea9ff]/10 border border-white/10"
                      >
                        <MessageSquare className="w-5 h-5 text-sky-300" />
                        <span className="text-xs font-medium">
                          {totalComments[comic._id] ?? 0}
                        </span>
                      </div>
                      <div
                        onClick={() => handleShare(comic)}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-md backdrop-blur-md bg-gradient-to-br from-[#6dc8ff]/20 to-[#5ea9ff]/10 border border-white/10"
                      >
                        <Share2 className="w-5 h-5" />
                      </div>
                    </div>
                  )}
  
                  {/* Comic details overlay */}
                  {!isCommentsOpen && (
                    <div className="absolute bottom-0 sm:bottom-8 left-0 w-full p-2 z-10 flex flex-col justify-end">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-2xl sm:text-sm font-bold line-clamp-1">
                          {comic.name}
                        </span>
                        •
                        <span className="text-sm opacity-70 sm:text-xs">
                          {comic.author?.name || "Unknown"}
                        </span>
                        •
                        <span className="ml-2 sm:text-xs inline-block min-w-fit text-xs px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                          {comic.episodes?.length} Episodes
                        </span>
                      </div>
  
                      <p className="mt-2 sm:mt-1 text-sm sm:text-xs font-light text-white/85 line-clamp-3">
                        {comic.description}
                      </p>
  
                      <div className="flex gap-2 flex-wrap mt-1">
                        {comic.tags?.map((tag) => (
                          <p
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded bg-white/10"
                          >
                            {tag}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none transition-all duration-300"></div>
                </div>
  
                {/* Desktop action buttons */}
                <div className="hidden sm:flex w-[50px] flex-col items-center justify-center p-2">
                  <button
                    onClick={() => handleLike(comic._id)}
                    className="p-2 flex flex-col items-center rounded-full cursor-pointer"
                  >
                    <span className="bg-[#1234] rounded-full h-10 w-10 flex items-center justify-center">
                      {likedComics.includes(comic._id) ? "❤️" : "🤍"}
                    </span>
                    <span className="font-medium text-xs">
                      {comic.likeCount ?? 0}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCommentsOpen(true);
                      setActiveComicId(comic._id);
                    }}
                    className="cursor-pointer"
                  >
                    <span className="bg-[#1234] rounded-full h-10 w-10 flex items-center justify-center">
                      <MessageSquare />
                    </span>
                    <span className="font-medium text-xs">
                      {totalComments[comic._id] ?? 0}
                    </span>
                  </button>
                  <button
                    onClick={() => handleShare(comic)}
                    className="cursor-pointer bg-[#1234] rounded-full h-10 w-10 flex items-center justify-center"
                  >
                    <Share2 />
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>

        {/* go back overlay */}
      <div onClick={() => navigate(-1)} className="fixed top-5 left-5 flex items-center justify-center px-1.5 backdrop-blur-md rounded-full py-1"> <ChevronLeft /> back</div>

      {/* Right comments section (desktop) */}
      <div
        className={`hidden sm:flex gap-2 transition-all duration-300 ${
          isCommentsOpen ? "flex-1" : "w-fit"
        }`}
      >
        <div className="flex flex-col items-end justify-center h-full gap-4 flex-1">
          <button
            onClick={() => scrollByCard("up")}
            className="p-4 border border-gray-500 rounded-full cursor-pointer hover:bg-gray-700 transition"
          >
            <ChevronUp />
          </button>
          <button
            onClick={() => scrollByCard("down")}
            className="p-4 border border-gray-500 rounded-full cursor-pointer hover:bg-gray-700 transition"
          >
            <ChevronDown />
          </button>
        </div>

        <div
          className={`relative border border-gray-600 rounded transition-all duration-300 overflow-hidden ${
            isCommentsOpen ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        >
          <div className="border-b border-gray-500 p-2 flex items-center justify-between">
            <p className="text-sm">
              Comments ({activeComicId ? totalComments[activeComicId] ?? 0 : 0})
            </p>
            <X
              className="cursor-pointer hover:text-red-400 transition"
              onClick={() => setIsCommentsOpen(false)}
            />
          </div>

          <div className="p-2 overflow-y-auto h-[calc(100%-50px)] [scrollbar-width:none]">
            {isCommentsOpen && activeComicId && (
              <CommentsSection comicId={activeComicId} msg={msg} />
            )}
          </div>

          {isCommentsOpen && (
            <div className="absolute bottom-0 w-full h-[50px] px-1 flex items-center gap-1.5 bg-[#010203be]">
              <div className="bg-black/25 w-10 h-10 flex items-center justify-center rounded-full">
                {user.user?.firstName[0].toUpperCase()}
                {user.user?.lastName[0].toUpperCase()}
              </div>
              <div className="flex-1 h-[40px] flex items-center bg-[#1234] rounded-full">
                <input
                  type="text"
                  placeholder="Add a comment"
                  className="text-sm rounded-lg h-[80%] w-full pl-2 bg-transparent text-white outline-none"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  className="ml-1 p-2 rounded-md hover:bg-gray-600 transition"
                  onClick={() => pushComment(activeComicId!)}
                >
                  <SendHorizonal size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default FeedDetail;

