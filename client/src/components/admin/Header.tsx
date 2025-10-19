import { useEffect, useState } from "react";
import {
  GalleryVerticalEnd,
  Menu,
  X,
  Upload,
  Film,
  BookOpen,
  NotebookPen,
  Plus,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import AddComicForm from "./AddComicForm";

type Comic = {
  _id: string;
  name: string;
  avgRating: number;
};

type CarouselItem = {
  _id: string;
  comic: Comic;
  logo: string;
};

const Header = ({ title }: { title: string }) => {
  const [greeting, setGreeting] = useState("Welcome");
  const { isMenuOpen, setIsMenuOpen } = useAppContext();
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [createComic, setCreateComic] = useState(false);
  const [tempLogo, setTempLogo] = useState<string | null>(null);
  const [isDeleteCarouselOpen, setIsDeleteCarouselOpen] = useState(false);
  const [comics, setComics] = useState<Comic[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [selectedCarouselInfo, setSelectedCarouselInfo] = useState<{
    name: string;
    avgRating: number;
  } | null>(null);

  const backendURL = import.meta.env.VITE_BackendURL;

  // Greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Fetch comics and carousel items
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [comicsRes, carouselRes] = await Promise.all([
          axios.get(`${backendURL}/api/comics/names`),
          axios.get(`${backendURL}/api/carousel`),
        ]);

        if (isMounted) {
          setComics(comicsRes.data.msg || []);
          setCarouselItems(carouselRes.data || []);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        toast.error("Failed to load data");
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (tempLogo) URL.revokeObjectURL(tempLogo);
    };
  }, [backendURL]);

  // Add Carousel
  const handleAddComicCarousel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const isDubbed = form.get("isDubbed") === "true";
    form.set("isDubbed", String(isDubbed));

    if (!form.get("logo") || !form.get("contentRated") || !form.get("comic")) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      const { data } = await axios.post(`${backendURL}/api/carousel/create`, form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.msg);
        setIsCarouselOpen(false);
        setTempLogo(null);

        // Refresh carousel
        const { data: refreshed } = await axios.get(`${backendURL}/api/carousel`);
        setCarouselItems(refreshed);
      } else {
        toast.error(data.msg || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Delete Carousel Item
  const handleDeleteCarouselItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const carouselId = formData.get("carouselId") as string;

    if (!carouselId) {
      toast.error("Select an item to delete");
      return;
    }

    try {
      const { data } = await axios.delete(`${backendURL}/api/carousel/delete/${carouselId}`, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.msg);
        setIsDeleteCarouselOpen(false);
        setCarouselItems((prev) => prev.filter((item) => item._id !== carouselId));
        setTempLogo(null);
        setSelectedCarouselInfo(null);
      } else {
        toast.error(data.msg || "Failed to delete carousel item");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.msg || error.message);
    }
  };

  return (
    <header className="w-full mt-6 px-4 z-50 sticky top-3">
      <div className="w-full flex items-center justify-between px-6 py-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
        {/* Title & Greeting */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black sm:hidden"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 capitalize">
              {title}
            </h1>
          </div>
          {title.toLowerCase() === "overview" && (
            <p className="text-sm text-gray-600">{greeting}, Admin 👋</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setCreateComic(!createComic)}
            title="Add new comic"
            className="border rounded-full cursor-pointer border-black/50 p-1.5"
          >
            {createComic ? <X /> : <Plus />}
          </div>

          <div
            title="Add new carousel"
            onClick={() => setIsCarouselOpen(!isCarouselOpen)}
            className="cursor-pointer"
          >
            <GalleryVerticalEnd />
          </div>

          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-2 py-1 bg-white/40 backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
              AD
            </div>
            <p className="text-sm text-gray-800 hidden sm:block">Admin</p>
          </div>
        </div>
      </div>

      {/* Add Carousel Modal */}
      {isCarouselOpen && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center bg-black/30 z-50 overflow-auto">
          <form
            onSubmit={handleAddComicCarousel}
            className="relative w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-5"
          >
            <p className="font-bold text-lg">Add To Carousel Item</p>
            <button
              type="button"
              onClick={() => setIsCarouselOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            >
              <X size={20} />
            </button>

            {/* Upload Logo */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <Upload size={18} /> Upload Logo
              </label>
              <input
                type="file"
                name="logo"
                id="logo"
                accept="image/*"
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (tempLogo) URL.revokeObjectURL(tempLogo);
                    const blobUrl = URL.createObjectURL(file);
                    setTempLogo(blobUrl);
                  }
                }}
              />
              {tempLogo && (
                <div className="mt-3">
                  <img
                    src={tempLogo}
                    alt="Preview"
                    className="w-full h-40 object-contain rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setTempLogo(null);
                      const logoInput = document.getElementById("logo") as HTMLInputElement;
                      if (logoInput) logoInput.value = "";
                    }}
                    className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Content Rated */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <Film size={18} /> Content Rated
              </label>
              <input
                type="text"
                name="contentRated"
                placeholder="e.g. PG-13, R"
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Dubbed */}
            <div className="flex flex-col gap-3 text-gray-700 font-medium">
              <label className="flex items-center gap-1.5">
                <NotebookPen size={16} /> Dubbed
              </label>
              <div className="flex gap-1.5">
                <input type="radio" name="isDubbed" value="true" /> <span>Yes</span>
              </div>
              <div className="flex gap-1.5">
                <input type="radio" name="isDubbed" value="false" /> <span>No</span>
              </div>
            </div>

            {/* Comic Select */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <BookOpen size={18} /> Select Comic
              </label>
              <select
                name="comic"
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select a Comic</option>
                {comics.map((comic) => (
                  <option key={comic._id} value={comic._id}>
                    {comic.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              Submit
            </button>

            <p
              title="Delete carousel item"
              onClick={() => setIsDeleteCarouselOpen(true)}
              className="text-center text-red-600 cursor-pointer border py-1.5 rounded-md"
            >
              Delete Carousel Item
            </p>
          </form>
        </div>
      )}

      {/* Delete Carousel Modal */}
      {isDeleteCarouselOpen && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center bg-black/30 z-50">
          <form
            onSubmit={handleDeleteCarouselItem}
            className="relative w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-5"
          >
            <p className="font-bold text-lg text-red-600">Delete Carousel Item</p>
            <button
              type="button"
              onClick={() => {
                setIsDeleteCarouselOpen(false);
                setTempLogo(null);
                setSelectedCarouselInfo(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            >
              <X size={20} />
            </button>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <BookOpen size={18} /> Select Carousel Item
              </label>
              <select
                name="carouselId"
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedItem = carouselItems.find((i) => i._id === selectedId);
                  if (selectedItem) {
                    setTempLogo(selectedItem.logo || null);
                    setSelectedCarouselInfo({
                      name: selectedItem.comic?.name || "Unknown",
                      avgRating: selectedItem.comic?.avgRating || 0,
                    });
                  } else {
                    setTempLogo(null);
                    setSelectedCarouselInfo(null);
                  }
                }}
              >
                <option value="">Select Carousel Item</option>
                {carouselItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.comic?.name || "Untitled"}
                  </option>
                ))}
              </select>
            </div>

            {tempLogo && selectedCarouselInfo && (
              <div className="mt-3 space-y-2 border border-gray-200 rounded-lg p-3 shadow-sm">
                <img
                  src={tempLogo}
                  alt="Carousel Preview"
                  className="w-full h-40 object-contain rounded-lg border"
                />
                <div className="text-center">
                  <p className="font-semibold text-gray-800 text-lg">
                    {selectedCarouselInfo.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rated:{" "}
                    <span className="font-medium">
                      {selectedCarouselInfo.avgRating.toFixed(1)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={
                        i < Math.round(selectedCarouselInfo.avgRating)
                          ? "currentColor"
                          : "none"
                      }
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-4 w-4"
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
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              Delete
            </button>
          </form>
        </div>
      )}

      <AddComicForm onclose={createComic} />
    </header>
  );
};

export default Header;
