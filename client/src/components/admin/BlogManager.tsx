import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  User,
  Eye,
  Image as ImageIcon,
  Type,
  FileText,
  Tags,
  Calendar,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import type { Blog } from "../../pages/Blogs";

const BlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [preview, setPreview] = useState<Blog | null>(null);

  const getBlogs = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/blogs`);
      if (!data.success) return toast.error(data.msg);
      setBlogs(data.blog);
    } catch (error: any) {
      toast.error(error.response?.message || error.message);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_BackendURL}/api/blogs/${id}`);
      if (data.success) {
        toast.success(data.msg);
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      } else toast.error(data.msg);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const url = editingBlog
        ? `${import.meta.env.VITE_BackendURL}/api/blogs/${editingBlog._id}`
        : `${import.meta.env.VITE_BackendURL}/api/blogs/create-blog`;

      const method = editingBlog ? "patch" : "post";
      const { data } = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.msg);
        setShowModal(false);
        setEditingBlog(null);
        getBlogs();
      } else toast.error(data.msg);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (

    <>
      {blogs.length === 0 ? (
        <div className="flex flex-col gap-5 items-center">
          <div className="sm:w-[250px]">
            <img src="/stars.svg" alt="stars" className="w-full h-full object-contain" />
          </div>
          <p>No blog found...</p>
          <button
              onClick={() => {
                setEditingBlog(null);
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 transition"
            >
              <Plus size={16} /> Add Blog
            </button>
    
        </div>
      ) : (
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Blog Posts ({blogs.length})</h2>
            <button
              onClick={() => {
                setEditingBlog(null);
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 transition"
            >
              <Plus size={16} /> Add Blog
            </button>
          </div>

          {/* Blog Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="relative rounded-xl shadow hover:shadow-md transition overflow-hidden border border-gray-200 h-[350px]"
                >
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                  <div className="space-y-2 p-2 w-full  absolute bottom-0 text-white z-10">
                    <h3 className="font-bold text-lg text-white">{blog.title}</h3>
                    <p className="text-sm line-clamp-3">{blog.excerpt}</p>
                    <div className="text-xs text-gray-300 flex items-center gap-1">
                      <User size={14} /> {blog.author} •{" "}
                      {new Date(blog.createdAt).toLocaleDateString().split("/").join("-")}
                    </div>
                    <div className="flex gap-3 mt-3 text-sm w-full">
                      <button
                        onClick={() => {
                          setEditingBlog(blog);
                          setShowModal(true);
                        }}
                        className="text-yellow-400 flex items-center gap-1 hover:underline"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-400 flex items-center gap-1 hover:underline"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                      <button className="flex items-center gap-1 text-blue-300 hover:underline"
                      onClick={() => setPreview(blog)}>
                        <Eye size={14} /> Preview
                      </button>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                </div>
              ))}
            </div>
        </div>
        )}
        

       {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4 overflow-auto">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl relative mt-[100px]">
            <button
              onClick={() => {
                setShowModal(false);
                setEditingBlog(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-4 text-gray-800">
              {editingBlog ? "Edit Blog" : "Create Blog"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* Title */}
              <label className="block text-gray-600 font-medium">
                <span className="flex items-center gap-2">
                  <Type size={16} /> Title
                </span>
                <input
                  name="title"
                  defaultValue={editingBlog?.title}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded"
                  placeholder="e.g. Intro to Manga Drawing"
                />
              </label>

              {/* Author */}
              <label className="block text-gray-600 font-medium">
                <span className="flex items-center gap-2">
                  <User size={16} /> Author
                </span>
                <input
                  name="author"
                  defaultValue={editingBlog?.author}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded"
                />
              </label>

              {/* Excerpt */}
              <label className="block text-gray-600 font-medium">
                <span className="flex items-center gap-2">
                  <FileText size={16} /> Short Excerpt
                </span>
                <textarea
                  name="excerpt"
                  defaultValue={editingBlog?.excerpt}
                  required
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border rounded resize-none"
                />
              </label>

              {/* Image Upload */}
              {!editingBlog && (
                <label className="block text-gray-600 font-medium">
                  <span className="flex items-center gap-2">
                    <ImageIcon size={16} /> Cover Image
                  </span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    required
                    className="mt-1 w-full px-3 py-2 border rounded"
                  />
                </label>
              )}

              {/* Tags */}
              <label className="block text-gray-600 font-medium">
                <span className="flex items-center gap-2">
                  <Tags size={16} /> Tags (comma-separated)
                </span>
                <input
                  name="tags"
                  defaultValue={editingBlog?.tags}
                  className="mt-1 w-full px-3 py-2 border rounded"
                />
              </label>

              {/* Main Body */}
              <label className="block text-gray-600 font-medium">
                <span className="flex items-center gap-2">
                  <FileText size={16} /> Body
                </span>
                <textarea
                  name="body"
                  defaultValue={editingBlog?.body}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border rounded resize-none"
                />
              </label>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {editingBlog ? "Update Blog" : "Add Blog"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* preview modal */}
      {preview && (
        <div className="fixed top-0 right-0 h-full sm:w-[calc(100vw-240px)] backdrop-blur-2xl z-60 bg-gradient-to-br from-[#1a2638] to-[#234] text-white overflow-auto">
          <div className="p-2.5 mt-3">
            <div className="flex items-center justify-end w-full py-2.5"><X onClick={() => setPreview(null)} /></div>
              <div className="">
                <div className="rounded-lg overflow-hidden shadow mb-8 sm:float-left sm:w-[250px] mr-3.5">
                  <img
                    src={preview.image}
                    alt={preview.title}
                    className="w-full h-64 sm:h-96 object-cover"
                  />
                </div>

                {/* Title and Meta */}
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 line-clamp-2 clear-both sm:clear-none text-shadow-lg text-shadow-amber-400 py-2">
                  {preview.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                  
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" color="blue"/>
                  {new Date(preview.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-1">
                  <User className="h-4 w-4"  color="green"/>
                  {preview.author}
                </div>

                {preview.tags && (
                  <div className="flex items-center gap-1">
                    <Tags className="h-4 w-4" color="yellow"/>
                    {Array.isArray(preview.tags)
                      ? preview.tags.join(", ")
                      : preview.tags}
                  </div>
                )}
              </div>

               {/* Body */}
                <article className="text-gray-300 leading-relaxed space-y-6 text-justify">
                  {preview.body.split("\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph.trim()}</p>
                  ))}
                </article>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogManager;
