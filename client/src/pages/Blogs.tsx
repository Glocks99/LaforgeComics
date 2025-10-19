import axios from "axios";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export type Blog = {
  _id: number;
  title: string;
  image: string;
  excerpt: string;
  createdAt: string;
  author: string;
  tags: string[];
  body: string;
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getBlogs = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/blogs`
      );

      if (!data.success) {
        toast.error(data.msg);
        return;
      }

      setBlogs(data.blog);
    } catch (error: any) {
      toast.error(error.response?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  if (isLoading) {
    return (
      <main className="bg-[#10141e] min-h-screen flex justify-center items-center text-white">
        <div className="h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <main className="bg-[#10141e] min-h-screen flex justify-center items-center text-gray-400">
        No blogs available.
      </main>
    );
  }

  const [featured, ...rest] = blogs;

  return (
    <main className="bg-[#10141e] min-h-screen px-4 sm:px-10 py-12">
      <section className="max-w-6xl mx-auto">
        {/* Back Button */}
        <p
          onClick={() => navigate("/")}
          className="sticky top-0 z-20 backdrop-blur-2xl py-3.5 flex items-center gap-1.5 text-yellow-300 cursor-pointer mb-6 hover:underline"
        >
          <ArrowLeft /> Back to home
        </p>

        {/* Hero Feature */}
        <div
          onClick={() => navigate(`/blogs/${featured._id}`)}
          className="relative w-full h-[50vh] sm:h-[65vh] mb-16 rounded-xl overflow-hidden cursor-pointer group"
        >
          <img
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10141e] via-black/60 to-transparent" />
          <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-end h-full">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-yellow-400 leading-snug group-hover:underline transition">
              {featured.title}
            </h1>
            <p className="text-gray-300 mt-3 max-w-2xl line-clamp-3">
              {featured.excerpt}
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-yellow-400" />
                {new Date(featured.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-yellow-400" />
                {featured.author}
              </div>
            </div>
          </div>
        </div>

        {/* Rest Blogs */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column with images (timeline + card style) */}
          <div className="relative border-l border-gray-700 pl-6 space-y-12">
            {rest.slice(0, Math.ceil(rest.length / 2)).map((blog, i) => (
              <div
                key={i}
                className="relative group cursor-pointer flex flex-col sm:flex-row gap-4"
                onClick={() => navigate(`/blogs/${blog._id}`)}
              >
                {/* timeline dot */}
                <div className="absolute -left-3 top-6 h-5 w-5 rounded-full bg-yellow-400 border-4 border-[#10141e]" />

                <div className="flex-shrink-0 w-full sm:w-40 h-28 rounded-lg overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-yellow-400 transition">
                    {blog.title}
                  </h2>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex gap-3 text-xs text-gray-500 mt-3">
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span>• {blog.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (already image summary highlights) */}
          <div className="space-y-10">
            {rest.slice(Math.ceil(rest.length / 2)).map((blog, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-6 items-center cursor-pointer group"
                onClick={() => navigate(`/blogs/${blog._id}`)}
              >
                <div className="flex-shrink-0 w-full sm:w-44 h-32 rounded-lg overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                    {blog.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {blog.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs rounded bg-yellow-500/20 text-yellow-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blogs;
