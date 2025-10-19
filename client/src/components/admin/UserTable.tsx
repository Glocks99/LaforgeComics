import { useEffect, useMemo, useState } from "react";
import { Eye, Trash2, Shield, X, Loader2, CheckCircle, XCircle, Search, ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt?: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 20;
  const backendURL = import.meta.env.VITE_BackendURL;

  // Fetch users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user`);
      if (data.success) setUsers(data.users);
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = searchQuery.toLowerCase();
      return (
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery]);


  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Toggle Admin
  const handleToggleAdmin = async (userId: string, current: boolean) => {
    try {
      await axios.put(`${backendURL}/api/user/${userId}`, { isAdmin: !current });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: !u.isAdmin } : u))
      );
      toast.success("User role updated");
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Failed to update role");
    }
  };

  // Toggle Verification
  const handleToggleVerified = async (userId: string, current: boolean) => {
    setVerifyLoading(true);
    try {
      await axios.put(`${backendURL}/api/user/${userId}`, { isVerified: !current });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isVerified: !u.isVerified } : u
        )
      );
      setSelectedUser((prev) => (prev ? { ...prev, isVerified: !prev.isVerified } : prev));
      toast.success(`User ${!current ? "verified" : "unverified"} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Failed to update verification");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${backendURL}/api/user/${id}`);
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        toast.success("User deleted");
      }
      setConfirmDeleteId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">
          User Management
        </h2>
        <div className="relative w-full sm:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 transition-all"
              >
                <td className="px-4 py-3 font-medium">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone || "N/A"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isAdmin
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={user.isAdmin}
                        onChange={() => handleToggleAdmin(user._id, user.isAdmin)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {user.isVerified ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : (
                    <XCircle size={18} className="text-gray-400" />
                  )}
                </td>

                <td className="px-4 py-3 text-right flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(user._id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`flex items-center gap-1 px-3 py-1 rounded-md border transition ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <ChevronLeft size={18} />
            Prev
          </button>
          <span className="text-gray-700 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            className={`flex items-center gap-1 px-3 py-1 rounded-md border transition ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    

      {/* User View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full relative transition-all">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                {selectedUser.firstName.charAt(0).toUpperCase()}
              </div>

              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {selectedUser.firstName}
                {selectedUser.isVerified && (
                  <CheckCircle size={16} className="text-green-500" />
                )}
              </h3>

              <p className="text-sm text-gray-600">{selectedUser.email}</p>
              <p className="text-sm text-gray-500">
                {selectedUser.phone || "No phone"}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <Shield
                  size={16}
                  className={`${
                    selectedUser.isAdmin ? "text-indigo-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm ${
                    selectedUser.isAdmin ? "text-indigo-600" : "text-gray-600"
                  }`}
                >
                  {selectedUser.isAdmin ? "Admin" : "User"}
                </span>
              </div>

              {/* Verified Switch */}
              <div className="flex flex-col items-center mt-5">
                <label className="flex items-center gap-3 text-gray-700 font-medium">
                  <span>Verified</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.isVerified}
                      onChange={() =>
                        handleToggleVerified(
                          selectedUser._id,
                          selectedUser.isVerified
                        )
                      }
                      disabled={verifyLoading}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                  {verifyLoading && <Loader2 size={16} className="animate-spin text-gray-500" />}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() => handleDeleteUser(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
