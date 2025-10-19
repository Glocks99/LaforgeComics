import { LogOut, Edit3, Bookmark, BookOpen, History, ChevronLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext";
// import { useNavigate } from "react-router-dom";
// import EditProfileModal from "../components/EditProfileModal";
import Modal from "../components/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAppContext();
  // const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Dummy reading stats & activity
  const stats = [
    { label: "Comics Read", value: 24, icon: <BookOpen size={18} /> },
    { label: "Books Read", value: 5, icon: <Bookmark size={18} /> },
    { label: "Favorites", value: 12, icon: <Bookmark size={18} /> },
  ];

  const recentActivity = [
    { id: 1, title: "Shazam: The Return", date: "2024-06-28" },
    { id: 2, title: "African Legends Vol. 1", date: "2024-06-25" },
    { id: 3, title: "Manga Heroes", date: "2024-06-20" },
  ];

  const onClose = () => {};

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#10141e] text-white flex flex-col px-4 sm:px-10 py-8">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">

        <div onClick={() => navigate(-1)} className="sticky top-0 left-0 h-[40px] z-20 text-white flex items-center cursor-pointer backdrop-blur-2xl">
            <ChevronLeft />
            Back
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-600 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-gradient-to-tr from-blue-400 to-blue-700 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
              {user?.user?.firstName
                ? user.user.firstName.slice(0, 1).toUpperCase()
                : "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {user?.user?.firstName || "Guest User"}
              </h1>
              <p className="text-gray-400 text-sm">
                {user?.user?.email || "No email provided"}
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setIsEditOpen(true)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded flex items-center gap-1.5 transition"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
            <Modal
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              title="Edit Your Profile"
            >
              {/* Form */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-gray-400">First Name</label>
                  <input
                    type="text"
                    defaultValue={user.user?.firstName}
                    className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user.user?.lastName}
                    className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <input
                    type="email"
                    defaultValue={user.user?.email}
                    className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={onClose}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // handle save here!
                    onClose();
                  }}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded transition"
                >
                  Save Changes
                </button>
              </div>
            </Modal>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded flex items-center gap-1.5 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1b2330] rounded p-4 flex flex-col items-center shadow-lg"
            >
              <div className="text-yellow-400 mb-2">{stat.icon}</div>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1b2330] rounded p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {recentActivity.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center justify-between bg-[#234] rounded px-4 py-3 hover:bg-[#32485e] cursor-pointer transition"
              >
                <History />
                <p className="line-clamp-1 w-full">{activity.title}</p>
                <p className="text-sm text-gray-400 line-clamp-1">
                  {activity.date}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={{
          firstName: user?.user?.firstName || "",
          lastName: user?.user?.lastName || "",
          email: user?.user?.email || "",
        }}
      /> */}
    </div>
  );
};

export default Profile;
