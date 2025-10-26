import { Edit3, ChevronLeft, Trash, User, Mail, Phone, CheckSquare, Eye, EyeClosed, X, CalendarCheck2, InfoIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.user?.firstName || "",
    lastName: user.user?.lastName || "",
    phone: user.user?.phone || "",
  });


 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};


  const handleSave = async () => {
    const hasEmpty = Object.entries(formData).some(([key, value]) => {
    if (!value) {
      toast.error(`"${key}" is required`);
      return true;
    }
    return false;
  });

  if (hasEmpty) return; // Stop submission


    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BackendURL}/api/user/${user.user?.id}`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser({ isLoggedIn: true, user: res.data.user });
        setIsEditOpen(false);
      } else {
        toast.error(res.data.msg || "Failed to update profile");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating profile");
    }
  };

  const deleteAcc = async(id: string) => {
    if(!id) return toast.error("Account not found!")
    try {
      const {data} = await axios.delete(`${import.meta.env.VITE_BackendURL}/api/user/${id}`)

      if(data.success){
        toast.success(data.msg)
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser({
        isLoggedIn: false,
        user: undefined,
      });
        setConfirmDel(false)
        navigate('/')
      }
      else{
        toast.error(data.msg)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#10141e] text-white flex flex-col px-4 sm:px-10 py-8">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">

        <div onClick={() => navigate(-1)} className="sticky top-0 h-[40px] text-white flex items-center cursor-pointer backdrop-blur-2xl">
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
              onClick={() => {
                if(!user.isLoggedIn) return toast.error("Login first to edit account!")
                setIsEditOpen(true)
              }}
              className="bg-yellow-500 w-full hover:bg-yellow-400 text-black px-4 py-2 rounded flex items-center gap-1.5 transition"
            >
              <Edit3 size={16} /> Edit Profile
            </button>

            <button
              onClick={() => {
                if(!user.isLoggedIn) return toast.error("Login first to delete account!")
                setConfirmDel(true)
              }}
              className="bg-red-600 w-full hover:bg-red-500 text-white px-4 py-2 rounded flex items-center gap-1.5 transition"
            >
              <Trash size={16} /> Delete acc
            </button>
          </div>
        </div>

        {confirmDel && (
          <div className="fixed inset-0 bg-black/60 z-10 px-2.5 flex flex-col justify-center">

            <div className="bg-black py-2.5">
              <p className="border-b border-white/10 text-2xl mb-2.5 font-medium">Confirm Deletion</p>
              <p>Are you sure you want to <span className="text-red-600 font-extrabold">delete</span> this account ?</p>
              <p className="text-xs flex items-center gap-2 border bg-white/10 border-white/10 px-1 rounded-full"><InfoIcon size={16} /> All related activities with this account will be wiped out clean</p>

              <div className="flex items-center gap-1 mt-2.5">
                <button onClick={() => setConfirmDel(false)}  className="bg-white/10 w-full rounded-md flex items-center justify-center gap-1 py-2.5"><X size={16} /> close</button>
                <button onClick={() => deleteAcc(user.user?.id)}  className="bg-red-600 w-full flex items-center justify-center gap-1 py-2.5 rounded-md"><Trash size={16} /> Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Your Profile"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder={user.user?.firstName}
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder={user.user?.lastName}
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
              />
            </div>


            <div>
              <label className="text-sm text-gray-400">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder={user.user?.phone}
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setIsEditOpen(false)}
              className="bg-gray-600 w-full hover:bg-gray-500 text-white px-4 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-yellow-500 w-full hover:bg-yellow-400 text-black px-4 py-2 rounded transition"
            >
              Save Changes
            </button>
          </div>
        </Modal>

       <div className="bg-white/10 rounded-lg p-1 flex flex-col gap-2.5">
       <div className="text-2xl font-semibold border-b border-white/10 py-2.5">Profile Details</div>
        <div className="flex items-center justify-between gap-1.5">
          <p className="flex items-center gap-0.5"><User size={16} /> Name:</p>
          <p className={ `${!isVisible && "blur-sm"}`}>{user.user?.firstName} {user.user?.lastName}</p>
        </div>
        <div className="flex items-center justify-between gap-1.5">
          <p className="flex items-center gap-0.5"><Mail size={16} /> Email:</p>
          <p className={ `${!isVisible && "blur-sm"}`}>{user.user?.email}</p>
        </div>
        <div className="flex items-center justify-between gap-1.5">
          <p className="flex items-center gap-0.5"><Phone size={16} /> Phone:</p>
          <p className={ `${!isVisible && "blur-sm"}`}>{user.user?.phone}</p>
        </div>
        <div className="flex items-center justify-between gap-1.5">
          <p className="flex items-center gap-0.5"><CheckSquare size={16} /> IsAccountVerified:</p>
          <p className={ `${!isVisible && "blur-sm"}`}>{user.user?.isVerified ? "verified" : "Not verified"}</p>
        </div>
        <div className="flex items-center justify-between gap-1.5">
          <p className="flex items-center gap-0.5"><CalendarCheck2 size={16} /> CreatedAt:</p>
          <p className={ `${!isVisible && "blur-sm"}`}>{user.user?.createdAt ? "00/00/25" : "Not Set"}</p>
        </div>

        <button onClick={() => user.isLoggedIn && setIsVisible(!isVisible)}  className="cursor-pointer flex mt-2.5 rounded-md items-center justify-center bg-green-400 py-2.5 gap-1.5">
          {isVisible ? 
          (<EyeClosed size={16} />): 
          (<Eye size={16} />)
          }
          {isVisible ? "Hide Details": "see Details"}
        </button>
       </div>

      
      </div>
    </div>
  );
};

export default Profile;
