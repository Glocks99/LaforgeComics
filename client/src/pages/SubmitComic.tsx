import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Upload,
  ImagePlus,
  Loader2,
  User,
  Type,
  Calendar,
  BookOpen,
  Tag,
  FileText,
} from "lucide-react";

const SubmitComic = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    genre: "",
    releaseDate: "",
    coverImage: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle text input changes
  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Simple validation
    const emptyField = Object.entries(formData).find(
      ([key, value]) => key !== "coverImage" && !value
    );
    if (emptyField) {
      toast.error(`"${emptyField[0]}" is required`);
      return;
    }

    if (!formData.coverImage) {
      toast.error("Please upload a cover image");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value as any);
      });

      await axios.post("http://localhost:3000/api/comics", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Comic submitted successfully!");

      setFormData({
        title: "",
        description: "",
        author: "",
        genre: "",
        releaseDate: "",
        coverImage: null,
      });
      setPreview(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit comic");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10141e] text-white flex flex-col items-center px-4 py-10">
      <div className="max-w-3xl w-full bg-[#1b2330] rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center gap-2">
          <Upload size={24} /> Submit Your Comic
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="text-gray-300 text-sm">Comic Title</label>
            <div className="relative mt-1">
              <Type
                size={18}
                className="absolute left-3 top-3 text-gray-400 pointer-events-none"
              />
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded bg-[#234] border border-gray-600 text-white focus:border-yellow-500 outline-none"
                placeholder="Enter comic title"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-300 text-sm">Description</label>
            <div className="relative mt-1">
              <FileText
                size={18}
                className="absolute left-3 top-3 text-gray-400 pointer-events-none"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-3 py-2 rounded bg-[#234] border border-gray-600 text-white focus:border-yellow-500 outline-none"
                placeholder="Short summary of your comic..."
              />
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="text-gray-300 text-sm">Author Name</label>
            <div className="relative mt-1">
              <User
                size={18}
                className="absolute left-3 top-3 text-gray-400 pointer-events-none"
              />
              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded bg-[#234] border border-gray-600 text-white focus:border-yellow-500 outline-none"
                placeholder="Enter author name"
              />
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className="text-gray-300 text-sm">Genre</label>
            <div className="relative mt-1">
              <Tag
                size={18}
                className="absolute left-3 top-3 text-gray-400 pointer-events-none"
              />
              <input
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded bg-[#234] border border-gray-600 text-white focus:border-yellow-500 outline-none"
                placeholder="e.g. Action, Fantasy, Sci-Fi..."
              />
            </div>
          </div>

          {/* Release Date */}
          <div>
            <label className="text-gray-300 text-sm">Release Date</label>
            <div className="relative mt-1">
              <Calendar
                size={18}
                className="absolute left-3 top-3 text-gray-400 pointer-events-none"
              />
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded bg-[#234] border border-gray-600 text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="text-gray-300 text-sm mb-1 block">
              Cover Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex items-center justify-center w-full sm:w-[200px] h-[200px] border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-yellow-400 transition">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImagePlus size={30} />
                    <p className="text-sm mt-1">Upload Image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg mt-4 flex items-center justify-center gap-2 transition"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <BookOpen size={18} /> Submit Comic
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComic;
