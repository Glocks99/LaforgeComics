import { X } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { firstName: string; lastName: string; email: string };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/60">
      <div className="bg-[#1b2330] rounded-lg w-[90%] max-w-md p-6 shadow-xl relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400">First Name</label>
            <input
              type="text"
              defaultValue={user.firstName}
              className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Last Name</label>
            <input
              type="text"
              defaultValue={user.lastName}
              className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              defaultValue={user.email}
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
      </div>
    </div>
  );
};

export default EditProfileModal;
