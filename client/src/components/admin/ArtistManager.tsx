// ArtistManager.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  Mail,
  Phone,
  Eye,
  Pencil,
  Ban,
  PlusCircle,
  X,
  Loader2,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";


type SocialLinks = {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  youtube?: string;
  contact?: string;
};

type Artist = {
  _id?: string;
  name: string;
  image?: string;
  coverImage?: string;
  email: string;
  bio: string;
  socialLinks?: SocialLinks;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
};

const API = import.meta.env.VITE_BackendURL || "http://localhost:3000";

const initialArtist = (): Artist => ({
  name: "",
  bio: "",
  image: "",
  coverImage: "",
  email: "",
  socialLinks: {
    twitter: "",
    instagram: "",
    facebook: "",
    website: "",
    youtube: "",
    contact: "",
  },
  phone: "",
});

type Work = {
  artist: string;
  comic: {
    _id: string;
    name: string;
    coverImage: string;
    tags: string[];
    description: string;
  };
};

const ITEMS_PER_PAGE = 20;

const ArtistManager: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filtered, setFiltered] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [editArtist, setEditArtist] = useState<Artist | null>(null);
  const [showBanConfirm, setShowBanConfirm] = useState<Artist | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [works, setWorks] = useState<Work[]>([]);

  // file previews state for add/edit
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const getWorks = async (artistId: string) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BackendURL}/api/works?artistId=${artistId}&limit=4`
      );
      setWorks(data);
    } catch (error: any) {
      console.error("Error fetching artist:", error.message);
    }
  };

  // fetch artists
  const getAllArtists = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/artist`);
      // Expecting { success: true, msg: [artists] } from your controller
      if (data?.success) {
        setArtists(Array.isArray(data.msg) ? data.msg : []);
        setFiltered(Array.isArray(data.msg) ? data.msg : []);
        setCurrentPage(1);
      } else {
        // fallback if API returns array directly or other shape
        if (Array.isArray(data)) {
          setArtists(data);
          setFiltered(data);
          setCurrentPage(1);
        } else {
          setArtists([]);
          setFiltered([]);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load artists");
      setArtists([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllArtists();
    // cleanup previews on unmount
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // search (real-time)
  useEffect(() => {
    if (!Array.isArray(artists)) return setFiltered([]);
    const q = search.trim().toLowerCase();
    if (!q) {
      setFiltered(artists);
      setCurrentPage(1);
      return;
    }
    const filteredList = artists.filter((a) => {
      const name = (a.name || "").toLowerCase();
      const email = (a.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
    setFiltered(filteredList);
    setCurrentPage(1);
  }, [search, artists]);

  // create or update artist
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editArtist) return;

    const toastId = toast.loading(editArtist._id ? "Updating artist..." : "Creating artist...");
    try {
      const form = new FormData();
      form.append("name", editArtist.name || "");
      form.append("bio", editArtist.bio || "");
      form.append("phone", editArtist.phone || "");
      form.append("email", editArtist.email || "");
      // socialLinks as JSON string
      form.append("socialLinks", JSON.stringify(editArtist.socialLinks || {}));

      if (imageFile) form.append("image", imageFile);
      if (coverFile) form.append("coverImage", coverFile);

      let res;
      if (editArtist._id) {
        // update
        res = await axios.put(`${API}/api/artist/update/${editArtist._id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // create
        res = await axios.post(`${API}/api/artist/create`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res?.data || res?.status === 201 || res?.status === 200) {
        toast.success(editArtist._id ? "Artist updated" : "Artist created");
        // reset local
        setImageFile(null);
        setCoverFile(null);
        setImagePreview(null);
        setCoverPreview(null);
        setEditArtist(null);
        await getAllArtists();
      } else {
        toast.error(res?.data?.message || "Save failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save artist");
    } finally {
      toast.dismiss(toastId);
    }
  };

  // delete
  const handleBan = async () => {
    if (!showBanConfirm || !showBanConfirm._id) return;
    const toastId = toast.loading("Removing artist...");
    try {
      const res = await axios.delete(`${API}/api/artist/delete/${showBanConfirm._id}`);
      if (res.data) {
        toast.success(res.data.msg);
        setArtists((prev) => prev.filter((a) => a._id !== showBanConfirm._id));
        setFiltered((prev) => prev.filter((a) => a._id !== showBanConfirm._id));
      } else {
        toast.error(res.data?.msg || "Failed to remove");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove artist");
    } finally {
      toast.dismiss(toastId);
      setShowBanConfirm(null);
    }
  };

  // handle image selection (preview)
  const handleImageSelect = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    const f = files[0];
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImagePreview(url);
  };

  const handleCoverSelect = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setCoverFile(null);
      setCoverPreview(null);
      return;
    }
    const f = files[0];
    setCoverFile(f);
    const url = URL.createObjectURL(f);
    setCoverPreview(url);
  };

  // open edit modal with previews
  const startEdit = (artist?: Artist) => {
    if (artist) {
      // clone to avoid mutating array item directly
      const clone = JSON.parse(JSON.stringify(artist)) as Artist;
      setEditArtist(clone);
      setImagePreview(artist.image ? (artist.image.startsWith("http") ? artist.image : `${API}${artist.image}`) : null);
      setCoverPreview(artist.coverImage ? (artist.coverImage.startsWith("http") ? artist.coverImage : `${API}${artist.coverImage}`) : null);
      setImageFile(null);
      setCoverFile(null);
    } else {
      setEditArtist(initialArtist());
      setImagePreview(null);
      setCoverPreview(null);
      setImageFile(null);
      setCoverFile(null);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 80);
  };

  // pagination helpers
  const totalPages = Math.max(1, Math.ceil((filtered?.length || 0) / ITEMS_PER_PAGE));
  const currentArtists = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🎨 Artist Manager</h1>
          <p className="text-sm text-gray-500">Manage artists and their works</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <input
            className="w-full sm:w-64 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            onClick={() => startEdit()}
          >
            <PlusCircle size={18} /> Add
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Loading artists...
        </div>
      ) : !Array.isArray(filtered) || filtered.length === 0 ? (
        <p className="text-center text-gray-500">No artists found.</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentArtists.map((artist) => (
              <div key={artist._id} className="bg-white rounded-2xl shadow-md overflow-hidden group">
                <div className="relative">
                  <img
                    src={ artist.coverImage ? (artist.coverImage.startsWith("http") ? artist.coverImage : `${API}${artist.coverImage}`) : "/placeholder-cover.jpg"}
                    alt={artist.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button onClick={() => {
                      setSelectedArtist(artist)
                      getWorks(artist._id || "")
                      }} className="p-2 rounded-full bg-white/80 hover:bg-white">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => startEdit(artist)} className="p-2 rounded-full bg-white/80 hover:bg-white">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setShowBanConfirm(artist)} className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white">
                      <Ban size={16} />
                    </button>
                  </div>

                  <div className="absolute left-4 bottom-3 bg-white/90 px-3 py-1 rounded-md">
                    <h3 className="text-sm font-semibold">{artist.name}</h3>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-700 line-clamp-3">{artist.bio}</p>
                  <div className="mt-3 flex gap-3 items-center text-sm text-gray-600">
                    {artist.email && <div className="flex items-center gap-2"><Mail className="text-indigo-600" /><span>{artist.email}</span></div>}
                    {artist.phone && <div className="flex items-center gap-2"><Phone className="text-indigo-600" /><span>{artist.phone}</span></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border transition ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Prev
            </button>

            <div className="px-3 py-1 rounded-md text-gray-700">
              Page {currentPage} / {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border transition ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Works modal */}
      {selectedArtist && (
        <div className="fixed pt-20 sm:pt-0 inset-0 overflow-auto bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative overflow-auto">
            <button onClick={() => setSelectedArtist(null)} className="absolute top-4 right-4 text-gray-600"><X /></button>
            <div className="flex gap-4 items-start mb-4">
              <img src={(selectedArtist.coverImage ? (selectedArtist.coverImage.startsWith("http") ? selectedArtist.coverImage : `${API}${selectedArtist.coverImage}`) : selectedArtist.image || "/placeholder-cover.jpg")} alt="cover" className="w-32 h-36 object-cover rounded" />
              <div>
                <h2 className="text-xl font-semibold">{selectedArtist.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedArtist.bio}</p>
                <div className="mt-3 flex gap-2 text-sm text-gray-600">
                  {selectedArtist.email && <div className="flex items-center gap-1"><Mail className="text-indigo-600" />{selectedArtist.email}</div>}
                  {selectedArtist.phone && <div className="flex items-center gap-1"><Phone className="text-indigo-600" />{selectedArtist.phone}</div>}
                </div>
              </div>
            </div>

            <h3 className="font-semibold mb-2">Works</h3>

            <div className="overflow-y-auto">
              {works && works.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {works.map((w, i) => (
                  <Link to={`/comic_detail/${w.comic._id}`}  key={i} className="border border-black/10 rounded-lg overflow-hidden">
                    <img src={w.comic.coverImage} alt={w.comic.name} className="w-full h-40 object-cover" />
                    <div className="p-3">
                      <h4 className="font-medium">{w.comic.name}</h4>
                      <div className="flex items-center gap-1.5">
                        {w.comic.tags.map(t => (
                          <p className="text-xs text-white px-2 bg-green-400 rounded-full">{t}</p>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : <p className="text-gray-500">No works available</p>}
            </div>
            
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {editArtist && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-10 overflow-auto">
          <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4 relative">
            <button type="button" onClick={() => { setEditArtist(null); setImagePreview(null); setCoverPreview(null); setImageFile(null); setCoverFile(null); }} className="absolute top-4 right-4 text-gray-500"><X /></button>
            <h2 className="text-xl font-semibold">{editArtist._id ? "Edit Artist" : "Add Artist"}</h2>

            
              <input
                className="p-3 border w-full rounded"
                placeholder="Name"
                value={editArtist.name}
                onChange={(e) => setEditArtist(prev => ({ ...prev!, name: e.target.value }))}
                required
              />
            

            <textarea
              className="w-full p-3 border rounded"
              placeholder="Bio"
              value={editArtist.bio}
              onChange={(e) => setEditArtist(prev => ({ ...prev!, bio: e.target.value }))}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex flex-col items-center gap-2 p-3 border rounded cursor-pointer text-center">
                <div className="text-sm font-medium">Image</div>
                <div className="w-full h-28 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {imagePreview ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" /> : <div className="text-xs text-gray-500">No image</div>}
                </div>
                <input ref={fileInputRef} onChange={(e) => handleImageSelect(e.target.files)} type="file" accept="image/*" className="hidden" />
              </label>

              <label className="flex flex-col items-center gap-2 p-3 border rounded cursor-pointer text-center">
                <div className="text-sm font-medium">Cover Image</div>
                <div className="w-full h-28 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {coverPreview ? <img src={coverPreview} alt="cover preview" className="w-full h-full object-cover" /> : <div className="text-xs text-gray-500">No cover</div>}
                </div>
                <input ref={coverInputRef} onChange={(e) => handleCoverSelect(e.target.files)} type="file" accept="image/*" className="hidden" />
              </label>

              <div className="flex flex-col gap-2">
                <input className="p-2 border rounded" placeholder="Phone" value={editArtist.phone || ""} onChange={e => setEditArtist(prev => ({ ...prev!, phone: e.target.value }))} />
                <input className="p-2 border rounded" placeholder="Email" value={editArtist.email || ""} onChange={e => setEditArtist(prev => ({ ...prev!, email: e.target.value }))} />
              </div>
            </div>

            {/* socialLinks fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="p-2 border rounded" placeholder="Twitter URL" value={editArtist.socialLinks?.twitter || ""} onChange={e => setEditArtist(prev => ({ ...prev!, socialLinks: { ...(prev!.socialLinks || {}), twitter: e.target.value } }))} />
              <input className="p-2 border rounded" placeholder="Instagram URL" value={editArtist.socialLinks?.instagram || ""} onChange={e => setEditArtist(prev => ({ ...prev!, socialLinks: { ...(prev!.socialLinks || {}), instagram: e.target.value } }))} />
              <input className="p-2 border rounded" placeholder="Facebook URL" value={editArtist.socialLinks?.facebook || ""} onChange={e => setEditArtist(prev => ({ ...prev!, socialLinks: { ...(prev!.socialLinks || {}), facebook: e.target.value } }))} />
              <input className="p-2 border rounded" placeholder="Website URL" value={editArtist.socialLinks?.website || ""} onChange={e => setEditArtist(prev => ({ ...prev!, socialLinks: { ...(prev!.socialLinks || {}), website: e.target.value } }))} />
              <input className="p-2 border rounded" placeholder="YouTube URL" value={editArtist.socialLinks?.youtube || ""} onChange={e => setEditArtist(prev => ({ ...prev!, socialLinks: { ...(prev!.socialLinks || {}), youtube: e.target.value } }))} />
              <input className="p-2 border rounded" placeholder="Contact (alt)" value={editArtist.socialLinks?.contact || ""} onChange={e => setEditArtist(prev => ({ ...prev!, socialLinks: { ...(prev!.socialLinks || {}), contact: e.target.value } }))} />
            </div>

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setEditArtist(null); setImagePreview(null); setCoverPreview(null); setImageFile(null); setCoverFile(null); }} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Ban confirmation */}
      {showBanConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-xl">
            <h3 className="text-lg font-semibold">Remove Artist</h3>
            <p className="text-sm text-gray-600 mt-2">Are you sure you want to remove <strong>{showBanConfirm.name}</strong>?</p>
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={() => setShowBanConfirm(null)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              <button onClick={handleBan} className="px-4 py-2 rounded bg-red-600 text-white">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistManager;
