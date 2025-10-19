// ComicsTable.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  FileText,
  Eye,
  User,
  ArrowRightCircle,
  Pencil,
  Trash2,
  X,
  Image,
  FilePlus2,
  Lock,
  Unlock,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

type Comic = {
  _id: string;
  name: string;
  author: { _id?: string; name: string } | any;
  pages: { number?: number; content?: string }[];
  coverImage?: string;
  description?: string;
  tags?: string[];
  genre?: string | { _id?: string; name?: string };
  views?: number;
  isPublished?: boolean;
  createdAt?: string;
  episodes?: any[]; 
};

type Genre = { _id: string; name: string; description?: string };
type Author = { _id: string; name: string };

const API = import.meta.env.VITE_BackendURL || "";

const ComicsTable: React.FC = () => {
  const navigate = useNavigate();

  // --- Core lists & loading
  const [comics, setComics] = useState<Comic[]>([]);
  const [featured, setFeatured] = useState<Comic | null>(null);
  const [_, setIsLoading] = useState<boolean>(true);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  // pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // modals & editors
  const [addComicOpen, setAddComicOpen] = useState(false);
  const [editComic, setEditComic] = useState<Comic | null>(null);
  const [deleteComic, setDeleteComic] = useState<Comic | null>(null);

  // episodes modal per comic
  const [episodesOpenFor, setEpisodesOpenFor] = useState<Comic | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  // episode form states
  const [creatingEpisode, setCreatingEpisode] = useState(false);
  const [episodeForm, setEpisodeForm] = useState({
    title: "",
    episodeNumber: 1,
    images: [] as File[],
    isLocked: false,
  });

  // episode edit
  const [editingEpisode, setEditingEpisode] = useState<any | null>(null);
  const [editingImages, setEditingImages] = useState<File[]>([]);

  // initial fetches
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Loading comics...");
    try {
      const [cRes, aRes, gRes] = await Promise.all([
        axios.get(`${API}/api/comics/admin`),
        axios.get(`${API}/api/artist`),
        axios.get(`${API}/api/genres`),
      ]);
      if (cRes.data?.success) {
        setComics(cRes.data.msg || []);
        setFeatured((cRes.data.msg && cRes.data.msg[0]) || null);
      }
      if (aRes.data?.success) setAuthors(aRes.data.msg || []);
      if (gRes.data?.success) setGenres(gRes.data.msg || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to load");
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  // derived pagination
  const totalPages = Math.max(1, Math.ceil(comics.length / itemsPerPage));
  const currentComics = comics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Comic CRUD (kept similar to your original)
  const handleDeleteComic = async () => {
    if (!deleteComic) return;
    const toastId = toast.loading("Deleting comic...");
    try {
      const { data } = await axios.delete(`${API}/api/comics/${deleteComic._id}`);
      if (data.success) {
        toast.success(data.msg || "Deleted");
        await fetchAll();
        setDeleteComic(null);
      } else {
        toast.error(data.msg || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // --- Episodes: open modal and fetch episodes for that comic
  const openEpisodesModal = async (comic: Comic) => {
    setEpisodesOpenFor(comic);
    setEpisodesLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/episodes?comicId=${comic._id}&limit=50`);
      if (data.success) {
        setEpisodes(data.episodes || data.msg || []);
      } else {
        toast.error(data.msg || "Failed to load episodes");
        setEpisodes([]);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
      setEpisodes([]);
    } finally {
      setEpisodesLoading(false);
    }
  };

  const closeEpisodesModal = () => {
    setEpisodesOpenFor(null);
    setEpisodes([]);
    setEpisodeForm({ title: "", episodeNumber: 1, images: [], isLocked: false });
    setEditingEpisode(null);
    setEditingImages([]);
  };

  // Create Episode (multipart/form-data). Backend should accept files as "images[]"
  const submitCreateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!episodesOpenFor) return;
    if (!episodeForm.title.trim()) return toast.error("Title required");
    if (!episodeForm.images.length) return toast.error("Add at least one image");

    setCreatingEpisode(true);
    const toastId = toast.loading("Creating episode...");

    try {
      const form = new FormData();
      form.append("comicId", episodesOpenFor._id);
      form.append("title", episodeForm.title);
      form.append("episodeNumber", String(episodeForm.episodeNumber));
      form.append("isLocked", String(episodeForm.isLocked));

      // append files
      episodeForm.images.forEach((file) => {
        form.append("images", file);
      });

      const { data } = await axios.post(`${API}/api/episodes`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Episode created");
        // refresh episodes list
        await openEpisodesModal(episodesOpenFor);
        // also refresh comics list for counts etc.
        await fetchAll();
        setEpisodeForm({ title: "", episodeNumber: episodeForm.episodeNumber + 1, images: [], isLocked: false });
      } else {
        toast.error(data.msg || "Failed to create");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      toast.dismiss(toastId);
      setCreatingEpisode(false);
    }
  };

  // Delete episode
  const handleDeleteEpisode = async (episodeId: string) => {
    if (!episodesOpenFor) return;
    const ok = confirm("Delete this episode?");
    if (!ok) return;
    try {
      const { data } = await axios.delete(`${API}/api/episodes/${episodeId}`);
      if (data.success) {
        toast.success("Episode deleted");
        await openEpisodesModal(episodesOpenFor);
        await fetchAll();
      } else {
        toast.error(data.msg || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Toggle lock
  const handleToggleLock = async (episodeId: string) => {
    try {
      const { data } = await axios.patch(`${API}/api/episodes/${episodeId}/lock`);
      if (data.success) {
        toast.success(data.msg || "Updated lock");
        if (episodesOpenFor) await openEpisodesModal(episodesOpenFor);
      } else {
        toast.error(data.msg || "Failed to toggle");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Edit episode: prefill form into editingEpisode
  const startEditEpisode = (ep: any) => {
    setEditingEpisode(ep);
    // editingImages for newly selected files
    setEditingImages([]);
    // scroll to edit area (if present) - small UX nicety
    setTimeout(() => {
      const el = document.getElementById("edit-episode-area");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const submitEditEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEpisode) return;
    const toastId = toast.loading("Updating episode...");
    try {
      // If editingImages has files, send as multipart, else send JSON
      if (editingImages.length > 0) {
        const form = new FormData();
        form.append("title", editingEpisode.title || "");
        form.append("episodeNumber", String(editingEpisode.episodeNumber || 1));
        form.append("isLocked", String(editingEpisode.isLocked ?? false));
        editingImages.forEach((f) => form.append("images", f));
        const { data } = await axios.put(`${API}/api/episodes/${editingEpisode._id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (data.success) {
          toast.success("Episode updated");
          if (episodesOpenFor) await openEpisodesModal(episodesOpenFor);
          setEditingEpisode(null);
          setEditingImages([]);
          await fetchAll();
        } else toast.error(data.msg || "Failed");
      } else {
        const payload = {
          title: editingEpisode.title,
          episodeNumber: editingEpisode.episodeNumber,
          isLocked: editingEpisode.isLocked,
        };
        const { data } = await axios.put(`${API}/api/episodes/${editingEpisode._id}`, payload);
        if (data.success) {
          toast.success("Episode updated");
          if (episodesOpenFor) await openEpisodesModal(episodesOpenFor);
          setEditingEpisode(null);
          await fetchAll();
        } else toast.error(data.msg || "Failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // View episode (navigate to viewer / increment view is handled by API get)
  const viewEpisode = (episodeId: string) => {
    // navigate to episode view page - which should call GET /api/episodes/:id and increment views
    navigate(`/episode/${episodeId}`);
  };

  // Add Comic (keeps same behavior you had)
  const handleAddComic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const toastId = toast.loading("Creating comic...");
    try {
      const { data } = await axios.post(`${API}/api/comics/add-comic`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (data.success) {
        toast.success("Comic created");
        setAddComicOpen(false);
        await fetchAll();
      } else {
        toast.error(data.msg || "Failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

 

  // --- handlers for file inputs
  const onEpisodeFilesSelected = (files: FileList | null) => {
    if (!files) return;
    setEpisodeForm((prev) => ({ ...prev, images: Array.from(files) }));
  };

  const onEditEpisodeFilesSelected = (files: FileList | null) => {
    if (!files) return;
    setEditingImages(Array.from(files));
  };

  // --- UX: click comic to set featured
  const handleSelectFeatured = (comic: Comic) => {
    setFeatured(comic);
    // small UX: scroll to top so the featured area is visible
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

   const handleUpdate = async(editComic: Comic) => {
    
    try {
      const {data} = await axios.put(`${API}/api/comics/update`,
        {
          comicId: editComic._id,
          name: editComic.name,
          description: editComic.description,
          isPublished: editComic.isPublished
        }
      )

      if(data.success){
        toast.success("updated comic")
        fetchAll()
        setEditComic(null);
      }
      else{
        toast.error(data.msg)
      }

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // --- Render
  return (
    <div className="space-y-8">
      {/* Featured */}
      <div className="bg-gradient-to-r from-white/90 to-white/80 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row gap-6 items-start">
        {featured ? (
          <>
            <img
              src={featured.coverImage}
              alt={featured.name}
              className="w-full sm:w-36 h-48  object-cover rounded-md shadow"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen /> {featured.name}
              </h2>
              <div className="flex gap-3 items-center mt-2 flex-wrap text-sm text-gray-600">
                <span className="flex items-center gap-1"><User /> {featured.author?.name}</span>
                <span className="flex items-center gap-1"><Calendar /> {featured.isPublished ? "Published" : "Draft"}</span>
                <span className="flex items-center gap-1"><FileText /> {featured.episodes?.length ?? 0} Episodes</span>
                <span className="flex items-center gap-1"><Eye /> {(featured.views ?? 0).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-700 mt-3 line-clamp-3">{featured.description}</p>
              <div className="mt-4 flex  text-sm items-center gap-2">
                <button onClick={() => navigate(`/comic_detail/${featured._id}`)} className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2">
                  Take me there <ArrowRightCircle />
                </button>
                <button onClick={() => openEpisodesModal(featured)} className="bg-gray-200 px-3 py-2 rounded">Manage Episodes</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 text-gray-500">No featured comic</div>
        )}
      </div>

      {/* Cards layout */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {currentComics.map((comic) => (
          <article
            key={comic._id}
            className={`bg-white/5 border border-white/8 rounded-2xl p-4 shadow-lg hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1`}
            onClick={() => handleSelectFeatured(comic)}
            role="button"
            aria-label={`Select ${comic.name} as featured`}
          >
            <div className="flex gap-3 overflow-auto [scrollbar-width:none]">
              <img src={comic.coverImage} className="w-24 h-32 object-cover rounded-lg" alt={comic.name} />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{comic.name}</h3>
                <p className="text-sm text-gray-300">{comic.author?.name}</p>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{comic.description}</p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/comic_detail/${comic._id}`);
                    }}
                    className="text-sm px-2 py-1 bg-blue-600 rounded text-white flex items-center gap-2"
                  >
                    <BookOpen size={16} /> Read
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditComic(comic);
                    }}
                    className="text-sm px-2 py-1 bg-yellow-400 rounded flex items-center gap-2"
                  >
                    <Pencil size={16} /> Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteComic(comic);
                    }}
                    className="text-sm px-2 py-1 bg-red-600 rounded text-white flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEpisodesModal(comic);
                    }}
                    className="text-sm px-2 py-1 bg-green-500 rounded text-white flex items-center gap-2"
                  >
                    <FilePlus2 size={16} /> Ep
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                {(comic.tags || []).map((t: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-200 text-blue-700 rounded text-xs">{t}</span>
                ))}
              </div>
              <div className="text-right">
                <div>{comic.createdAt ? new Date(comic.createdAt).toLocaleDateString() : ""}</div>
                <div className="text-xs text-gray-500">Views: {(comic.views || 0).toLocaleString()}</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-100">Prev</button>
        <div>Page {currentPage} / {totalPages}</div>
        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded bg-gray-100">Next</button>
      </div>

      {/* Add Comic Modal */}
      {addComicOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-xl p-6 overflow-auto relative">
            <button onClick={() => setAddComicOpen(false)} className="absolute top-4 right-4 text-gray-500"><X /></button>
            <h3 className="text-xl font-semibold mb-4">Add Comic</h3>
            <form onSubmit={handleAddComic} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input name="name" placeholder="Name" required className="p-2 border rounded" />
                <select name="author" required className="p-2 border rounded">
                  <option value="">Select author</option>
                  {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
              <input name="description" placeholder="Short description" className="p-2 border rounded w-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="file" name="coverImage" accept="image/*" className="p-2 border rounded" />
                <input name="tags" placeholder="tags (comma separated)" className="p-2 border rounded" />
                <select name="genre" className="p-2 border rounded">
                  <option value="">Select genre</option>
                  {genres.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setAddComicOpen(false)} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Comic Modal */}
      {editComic && (
        <div className="fixed inset-0 z-50 bg-white/10 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button onClick={() => setEditComic(null)} className="absolute top-4 right-4 text-gray-500"><X /></button>
            <h3 className="text-xl font-semibold mb-4">Edit Comic</h3>
            <label htmlFor="">Title</label>
            <input value={editComic.name} onChange={e => setEditComic({ ...editComic, name: e.target.value })} className="p-2 border border-black/50 rounded w-full mb-2" />
            <label htmlFor="">Description</label>
            <textarea value={editComic.description} onChange={e => setEditComic({ ...editComic, description: e.target.value })} className="p-2 border border-black/50 h-[200px] rounded w-full mb-2" />
            <div className="border mb-2.5 p-1 border-black/50 rounded-md flex flex-col">
              <label htmlFor="">IsPublished <span className="text-xs">(visible to user)</span></label>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isPublished"
                    value="true"
                    checked={editComic.isPublished === true}
                    onChange={() => setEditComic({ ...editComic, isPublished: true })}
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isPublished"
                    value="false"
                    checked={editComic.isPublished === false}
                    onChange={() => setEditComic({ ...editComic, isPublished: false })}
                  />
                  No
                </label>
              </div>

            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditComic(null)} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
              <button onClick={() => {
                handleUpdate(editComic)
              }} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Comic Confirm */}
      {deleteComic && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
            <button onClick={() => setDeleteComic(null)} className="absolute top-4 right-4 text-gray-500"><X /></button>
            <h3 className="text-lg font-bold">Delete Comic</h3>
            <p className="text-sm text-gray-600 mt-2">Are you sure you want to delete <strong>{deleteComic.name}</strong>?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setDeleteComic(null)} className="px-3 py-1 rounded bg-gray-200">Cancel</button>
              <button onClick={handleDeleteComic} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Episodes Modal - enhanced UI */}
      {episodesOpenFor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-6 overflow-auto">
          <div className="bg-white rounded-2xl w-full max-w-6xl p-6 relative shadow-2xl">
            <button onClick={() => closeEpisodesModal()} className="absolute top-4 right-4 text-gray-600"><X /></button>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <img src={episodesOpenFor.coverImage} alt="cover" className="w-full sm:w-36 h-48 object-cover rounded-lg shadow" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{episodesOpenFor.name}</h3>
                <div className="flex gap-3 items-center text-sm text-gray-600">
                  <div className="flex items-center gap-1"><User /> {episodesOpenFor.author?.name}</div>
                  <div className="flex items-center gap-1"><FileText /> {episodes.length} episodes</div>
                  <div className="flex items-center gap-1"><Eye /> {(episodesOpenFor.views || 0).toLocaleString()} views</div>
                </div>
                <p className="text-sm text-gray-700 mt-3 line-clamp-2">{episodesOpenFor.description}</p>
              </div>
            </div>

            <hr className="my-4" />

            {/* Episodes grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodesLoading ? (
                <div className="text-sm text-gray-500 col-span-full">Loading episodes...</div>
              ) : episodes.length === 0 ? (
                <div className="text-sm text-gray-500 col-span-full">No episodes yet</div>
              ) : episodes.map((ep) => (
                <div key={ep._id} className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition flex flex-col">
                  <div className="relative">
                    <div
                      className="w-full h-40 bg-cover bg-center rounded-md"
                      style={{ backgroundImage: `url(${ep.images?.[0] || episodesOpenFor.coverImage})` }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded text-xs ${ep.isLocked ? "bg-yellow-500 text-white" : "bg-green-200 text-green-800"}`}>
                        {ep.isLocked ? "Locked" : "Free"}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 text-white text-xs bg-black/30 px-2 py-1 rounded">
                      {ep.episodeNumber}
                    </div>
                  </div>

                  <div className="mt-3 flex-1">
                    <h4 className="font-semibold">{ep.title}</h4>
                    <div className="text-xs text-gray-500">Episode {ep.episodeNumber} • {ep.releaseDate ? new Date(ep.releaseDate).toLocaleDateString() : "—"}</div>
                    <div className="text-xs text-gray-600 mt-2">{(ep.images || []).length} images • {ep.views || 0} views</div>
                  </div>

                  <div className="mt-3 flex gap-2 items-center">
                    <button onClick={() => viewEpisode(ep._id)} className="flex-1 px-3 py-2 rounded bg-blue-600 text-white text-sm">View</button>
                    <button onClick={() => startEditEpisode(ep)} className="px-3 py-2 rounded bg-yellow-400 text-sm">Edit</button>
                    <button onClick={() => handleDeleteEpisode(ep._id)} className="px-3 py-2 rounded bg-red-600 text-white text-sm"><Trash2 /></button>
                    <button onClick={() => handleToggleLock(ep._id)} className="px-3 py-2 rounded bg-gray-100 text-sm">
                      {ep.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* Create Episode Form - nicer UI */}
            <form onSubmit={submitCreateEpisode} className="space-y-3 bg-gray-50 p-4 rounded-lg shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  required
                  value={episodeForm.title}
                  onChange={e => setEpisodeForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Episode title"
                  className="p-3 border rounded shadow-sm border-black/50"
                />
                <input
                  required
                  type="number"
                  value={episodeForm.episodeNumber}
                  onChange={e => setEpisodeForm(prev => ({ ...prev, episodeNumber: Number(e.target.value) }))}
                  className="p-3 border border-black/50 rounded shadow-sm"
                />
                <label className="p-3 border border-black/50 rounded flex items-center gap-3 justify-center flex-col cursor-pointer bg-white/40 text-center">
                  <div className="flex items-center gap-2">
                    <Image /> <span className="text-sm">Add images</span>
                  </div>
                  <input onChange={e => onEpisodeFilesSelected(e.target.files)} type="file" accept="image/*" multiple className="hidden" />
                  <div className="text-xs text-gray-500">PNG, JPG — multiple allowed</div>
                </label>
              </div>

              {/* thumbnails + controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2">
                  {episodeForm.images.map((f, idx) => {
                    const url = URL.createObjectURL(f);
                    return (
                      <div key={idx} className="w-20 h-14 rounded overflow-hidden border">
                        <img src={url} alt={f.name} className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                </div>

                <label className="flex items-center gap-2">
                  <input checked={episodeForm.isLocked} onChange={e => setEpisodeForm(prev => ({ ...prev, isLocked: e.target.checked }))} type="checkbox" /> Lock episode (premium)
                </label>

                <div className="ml-auto w-full sm:w-auto">
                  <button type="submit" disabled={creatingEpisode} className="px-4 py-2 bg-green-600 text-white rounded w-full sm:w-auto">
                    {creatingEpisode ? "Creating..." : "Create Episode"}
                  </button>
                </div>
              </div>
            </form>

            {/* Edit Episode Inline Panel */}
            {editingEpisode && (
              <div id="edit-episode-area" className="mt-4 p-4 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Edit Episode — {editingEpisode.title}</h4>
                  <button onClick={() => setEditingEpisode(null)} className="text-gray-500"><X /></button>
                </div>

                <form onSubmit={submitEditEpisode} className="space-y-3 mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      value={editingEpisode.title}
                      onChange={e => setEditingEpisode({ ...editingEpisode, title: e.target.value })}
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
                      value={editingEpisode.episodeNumber}
                      onChange={e => setEditingEpisode({ ...editingEpisode, episodeNumber: Number(e.target.value) })}
                      className="p-2 border rounded"
                    />
                    <label className="p-2 border rounded flex items-center gap-2 cursor-pointer justify-center">
                      <Image /> Replace/Add images
                      <input onChange={e => onEditEpisodeFilesSelected(e.target.files)} type="file" accept="image/*" multiple className="hidden" />
                    </label>
                  </div>

                  {/* preview of existing images */}
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {(editingEpisode.images || []).slice(0, 6).map((imgUrl: string, i: number) => (
                      <div key={i} className="w-24 h-16 rounded overflow-hidden border">
                        <img src={imgUrl} alt={`img-${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {/* new selected files preview */}
                    {editingImages.map((f, idx) => {
                      const url = URL.createObjectURL(f);
                      return (
                        <div key={`new-${idx}`} className="w-24 h-16 rounded overflow-hidden border">
                          <img src={url} alt={f.name} className="w-full h-full object-cover" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingEpisode(null)} type="button" className="px-3 py-1 rounded bg-gray-200">Cancel</button>
                    <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComicsTable;
