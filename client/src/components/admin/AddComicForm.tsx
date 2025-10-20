import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Upload } from "lucide-react";

type Comic = {
  _id?: string;
  name: string;
  description: string;
  author: string;
  genre: string;
  tags: string;
  coverImage?: string;
};

type Artist = {
  _id: string;
  name: string;
};

type Genre = {
  _id: string;
  name: string
}

const API = import.meta.env.VITE_BackendURL || "http://localhost:3000";

const AddComic = ({onclose}: {onclose: boolean}) => {
  const [comic, setComic] = useState<Comic>({
    name: "",
    description: "",
    author: "",
    genre: "",
    tags: ""
  });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [_, setFileName] = useState<string>("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState<Genre[]>([])

  // Fetch all artists for dropdown
  const fetchArtists = async () => {
    try {
      const { data } = await axios.get(`${API}/api/artist`);
      setArtists(data.msg || []);
    } catch (error) {
      toast.error("Failed to load artists");
    }
  };

  useEffect(() => {
    fetchArtists();
    getGenre()
  }, []);

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comic.name || !comic.description || !comic.author) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    Object.entries(comic).forEach(([key, value]) => {
      formData.append(key, value as string);
    });


    try {
      setLoading(true);
      await axios.post(`${API}/api/comics/add-comic`, formData);
      toast.success("Comic added successfully!");
      setComic({
        name: "",
        description: "",
        author: "",
        genre: "",
        tags: ""
      });
      setCoverPreview(null);
      setFileName("");
    } catch (error) {
      toast.error("Error adding comic");
    } finally {
      setLoading(false);
    }
  };

  const getGenre = async() => {
    try {
      const {data} = await axios.get(`${import.meta.env.VITE_BackendURL}/api/genres`)

      if(data.success){
        setGenre(data.msg)
      }
      else{
        toast.error(data.msg)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className={`${!onclose && "hidden"} h-screen pb-38 overflow-auto`}>
      <Toaster position="top-right" />

      <div className="">
        
      <div className="bg-white rounded-xl p-6 shadow-md max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">📚 Add Comic</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              placeholder="Enter comic title"
              value={comic.name}
              onChange={(e) => setComic({ ...comic, name: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border p-2 rounded"
              rows={4}
              placeholder="Enter a short description"
              value={comic.description}
              onChange={(e) =>
                setComic({ ...comic, description: e.target.value })
              }
            />
          </div>

          {/* Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Artist
            </label>
            <select
              className="w-full border p-2 rounded"
              value={comic.author}
              onChange={(e) => setComic({ ...comic, author: e.target.value })}
            >
              <option value="">Select an artist</option>
              {artists.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Genre and Tags */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select className="w-full border p-2 rounded" onChange={(e) => setComic({...comic, genre: e.target.value})} name="" id="">
                <option value="">select genre</option>
                {genre.map(item => (
                  <option key={item.name} value={item._id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-xs">(seperated by comma)</span>
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={comic.tags}
              placeholder="funny, slice of life..."
              onChange={(e) =>
                setComic({ ...comic, tags: e.target.value })
              }
            />
          </div>
          </div>

          {/* Cover Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
            </label>
            <div className="border-2 border-dashed rounded p-4 text-center hover:bg-gray-50 transition">
              <input
                type="file"
                accept="image/*"
                id="cover-upload"
                name="coverImage"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    (comic as any).coverImage = file;
                    setCoverPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <label
                htmlFor="cover-upload"
                className="cursor-pointer text-indigo-600 flex flex-col items-center"
              >
                <Upload className="mb-1" />
                {coverPreview ? "Change Cover" : "Upload Cover"}
              </label>
            </div>
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Preview"
                className="w-full h-56 object-cover rounded mt-3"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded flex items-center justify-center gap-2"
          >
            {loading ? "Saving..." : "Add Comic"}
          </button>
        </form>
      </div>
      </div>

    </div>
  );
};

export default AddComic;
