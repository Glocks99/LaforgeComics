import axios from "axios";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type { Blog } from "./Blogs";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const getBlogs = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/blogs/${id}`
      );

      if (!data.success) {
        setErrorMsg(data.msg || "Failed to fetch blog.");
        toast.error(data.msg);
      } else {
        setBlogs(data.blog);
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching blog.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <main className="bg-[#0b0f19] min-h-screen text-white">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium transition"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : errorMsg ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center bg-red-900/30 text-red-400 font-semibold rounded-lg p-6">
            {errorMsg}
          </div>
        </div>
      ) : blogs ? (
        <>
          {/* Hero Section */}
          <header className="relative w-full h-[60vh] sm:h-[70vh]">
            <img
              src={blogs.image}
              alt={blogs.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-black/60 to-transparent"></div>
            <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 h-full flex flex-col justify-end pb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-snug mb-4 text-yellow-400 drop-shadow-lg">
                {blogs.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-yellow-400" />
                  {new Date(blogs.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-yellow-400" />
                  {blogs.author}
                </div>
              </div>
            </div>
          </header>

          {/* Article Section */}
          <section className="max-w-5xl mx-auto px-6 sm:px-10 py-12 flex gap-10">
            {/* Side Meta (desktop) */}
            <aside className="hidden lg:flex flex-col gap-6 w-40 text-gray-400 sticky top-24 h-fit">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-yellow-400" />
                <span>{blogs.author}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-yellow-400" />
                <span>
                  {new Date(blogs.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              {blogs.tags && (
                <div className="flex flex-col gap-2">
                  <span className="uppercase text-xs text-gray-500">Tags</span>
                  <div className="flex flex-col gap-1">
                    {Array.isArray(blogs.tags)
                      ? blogs.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))
                      : (
                        <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded-md text-xs">
                          {blogs.tags}
                        </span>
                      )}
                  </div>
                </div>
              )}
            </aside>

            {/* Body */}
            <article className="flex-1 text-gray-300 leading-relaxed space-y-8 overflow-hidden">
              {blogs.body.split("\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-lg sm:text-xl tracking-wide first-letter:text-5xl first-letter:font-bold first-letter:text-yellow-400"
                >
                  {paragraph.trim()}
                  
                </p>
              ))}
            </article>
          </section>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center bg-red-900/30 text-red-400 font-semibold rounded-lg p-6">
            Blog not found.
          </div>
        </div>
      )}
    </main>
  );
};

export default BlogDetail;
