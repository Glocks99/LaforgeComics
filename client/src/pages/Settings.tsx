import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleQuestionMark,
  Coins,
  Headset,
  Lock,
  LogOut,
  Mail,
  MailCheck,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getColorFromName } from "../components/CommentsSeaction";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import toast from "react-hot-toast";

export const faqData = [
  {
    question: "What is LaForge Comics?",
    answer:
      "LaForge Comics is a digital platform that celebrates creativity, storytelling, and art from around the world — especially Africa. We host comics, graphic novels, and illustrated stories created by emerging and established artists.",
  },
  {
    question: "How do I read comics on the site?",
    answer:
      "Simply browse our comic library, click on any title that interests you, and start reading instantly. Some comics are free to read, while others may require an account or subscription in the future.",
  },
  {
    question: "Do I need to create an account to read?",
    answer:
      "You can read most comics without an account, but signing up allows you to like, comment, rate, and save your favorite titles — and get personalized recommendations.",
  },
  {
    question: "Can I upload my own comic?",
    answer:
      "Yes! We welcome submissions from artists and writers. You can create an account and visit the “Upload” or “Submit Work” section to share your project. Our team reviews every submission before publishing.",
  },
  {
    question: "Is LaForge Comics free?",
    answer:
      "Most content is free to access. However, some premium or exclusive series may be behind a paywall or subscription in the future to support creators.",
  },
  {
    question: "Who owns the comics uploaded to the site?",
    answer:
      "Creators retain full rights to their work. LaForge Comics only hosts and promotes the content under the terms agreed upon during submission.",
  },
  {
    question: "How can I report a problem or bug?",
    answer:
      "If you encounter an issue, visit the Contact page or email us at support@laforgecomics.com with a brief description and screenshot. We’ll look into it as soon as possible.",
  },
  {
    question: "Can I collaborate with LaForge Comics?",
    answer:
      "Yes! We love working with artists, writers, and brands. Reach out via our Contact or Partnership page to discuss collaborations.",
  },
];

const Settings = () => {
  const [IsEmailOpen, setEmailOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [ispassOpen, setIsPassOpen] = useState(false);
  const [isCsOpen, setIsCsOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [email, setEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { user, logout, sendverifyEmail, setUser } = useAppContext();
  const navigate = useNavigate();

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const updateEmail = async(id: string) => {
    if(!id) return toast.error("Login into account!")

    if(email === "" || user.user?.email === email){
      return toast.error("change the current email!")
    }
    
    try {
      const {data} = await axios.put(`${import.meta.env.VITE_BackendURL}/api/user/${id}`,
        {email, isVerified: false}
      )

      if(data.success){
        toast.success(data.msg)
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser({ isLoggedIn: true, user: data.user });
      }
    } catch (error: any) {
      toast.error(error.msg)
    }
    finally{
      setEmailOpen(!IsEmailOpen)
    }
  }

  const updatePassword = async(id: string) => {
    if(!id) return toast.error("Login into account!")

    if(oldPassword.trim() === "" || 
      newPassword.trim() === "" ||
      confirmPassword.trim() === "" ){
        return toast.error("required fields")
      }

    if(confirmPassword !== newPassword){
      return toast.error("passwords must match!")
    }
    
      
    try {
      const {data} = await axios.put(`${import.meta.env.VITE_BackendURL}/api/user/${id}`,
        {newPassword, oldPassword}
      )

      if(data.success){
        toast.success(data.msg)
      }
    } catch (error: any) {
      toast.error(error.msg)
    }
    finally{
      setIsPassOpen(!ispassOpen)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-1 bg-[#123] h-screen p-[12px] sm:p-[16px]">
      <div
        onClick={() => navigate(-1)}
        className="flex items-center sm:h-fit gap-1.5 cursor-pointer border border-white/10 rounded-full pr-3 py-1 backdrop-blur-2xl text-white w-fit"
      >
        <ChevronLeft />
        Back
      </div>

      <div className="bg-black/25 sm:flex-1 rounded-lg py-1 flex flex-col items-center gap-2.5">
        <div
          className="relative h-36 w-36 sm:w-full sm:h-[75%] border sm:rounded-none rounded-full border-white/10 flex items-center justify-center text-3xl font-bold text-white"
          style={{
            backgroundColor: getColorFromName(
              user.user?.firstName[0] + user.user?.lastName[0]
            ),
          }}
        >
          <img src="/blob.gif" className="block absolute z-0" alt="" />
          <div className="absolute">
            {user.user?.firstName[0] || "G"}
            {user.user?.lastName[0] || "U"}
          </div>
        </div>
        <div className="text-sm text-indigo-400">
          {user.user?.email || "Guest user"}
        </div>
        <div className="text-white text-sm flex items-center gap-2.5">
          Email:{" "}
          <p
            className={`${
              user.user?.isVerified ? "text-green-400" : "text-red-500"
            } flex items-center gap-1`}
          >
            {user.user?.email
              ? user.user?.isVerified
                ? "verified"
                : "Unverified"
              : "No email provided"}{" "}
            <span
              className={`border border-white/10 rounded-full ${
                user.user?.isVerified ? "bg-green-400" : "bg-red-500"
              } text-white`}
            >
              {user.user?.isVerified ? <Check size={16} /> : <X size={16} />}
            </span>
          </p>
        </div>
        <Link
          to={"/profile"}
          className="bg-blue-500 text-white px-2.5 rounded-full py-1.5 flex items-center"
        >
          view profile <ChevronRight size={16} />
        </Link>
      </div>

      <div className="overflow-auto transition-all duration-300 text-white mt-5 flex flex-col gap-2.5 sm:w-[300px] rounded-md p-0.5 flex-1">
        <div
          onClick={() => setEmailOpen(true)}
          className="border bg-white/10 border-white/10 p-1.5 rounded-full flex items-center justify-between"
        >
          <span className="flex items-center gap-1">
            <Mail size={16} /> change Email
          </span>{" "}
          <ChevronRight size={16} />
        </div>

        <div onClick={() => {
          if(user.user?.isVerified) return toast.error("account already verified")
          sendverifyEmail()
        }}  className="border bg-white/10 border-white/10 p-1.5 rounded-full flex items-center justify-between">
          <span className="flex items-center gap-1">
            <MailCheck size={16} /> verify Email
          </span>{" "}
          <ChevronRight size={16} />
        </div>

        <div onClick={() => setIsPassOpen(true)}  className="border border-white/10 p-1.5 rounded-full flex items-center justify-between bg-white/10">
          <span className="flex items-center gap-1">
            <Lock size={16} /> change Password
          </span>{" "}
          <ChevronRight size={16} />
        </div>

        <div onClick={() => setIsCsOpen(true)}  className="border border-white/10 p-1.5 rounded-full flex items-center justify-between bg-white/10">
          <span className="flex items-center gap-1">
            <Headset size={16} /> customer service
          </span>{" "}
          <ChevronRight size={16} />
        </div>

        <div
          onClick={() => navigate("/support")}
          className="border border-white/10 p-1.5 rounded-full flex items-center justify-between bg-white/10"
        >
          <span className="flex items-center gap-1">
            <Coins size={16} /> Donations
          </span>
          <ChevronRight size={16} />
        </div>

        <div
          onClick={() => setIsFaqOpen(true)}
          className="border border-white/10 p-1.5 rounded-full flex items-center justify-between bg-white/10"
        >
          <span className="flex items-center gap-1">
            <CircleQuestionMark size={16} /> FAQ
          </span>
          <ChevronRight size={16} />
        </div>

        <div
          onClick={() => logout()}
          className="border border-red-500 p-1.5 rounded-full flex items-center justify-between bg-red-500"
        >
          <span className="flex items-center gap-1">
            <LogOut size={16} /> Logout
          </span>{" "}
          <ChevronRight size={16} />
        </div>
      </div>

      {/* Email Modal */}
      <Modal
        isOpen={IsEmailOpen}
        onClose={() => setEmailOpen(!IsEmailOpen)}
        title="Change your email"
      >
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <input
            type="email"
            defaultValue={user.user?.email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
          />
        </div>

        <div className="flex gap-1.5 mt-1.5">
          <button
            onClick={() => setEmailOpen(!IsEmailOpen)}
            className="text-white bg-gray-600 cursor-pointer w-full py-2"
          >
            close
          </button>
          <button onClick={() => updateEmail(user.user?.id)}  className="text-white bg-green-400 cursor-pointer w-full py-2">
            change
          </button>
        </div>
      </Modal>

     {/* customer service */}
      <Modal
        isOpen={isCsOpen}
        onClose={() => setIsCsOpen(!isCsOpen)}
        title="Contact Us"
      >
        <div className="text-white text-sm space-y-3">
          <p>
            Reach us on our hotlines or send us a message — we’re here to help with
            any issue, feedback, or suggestion you may have.
          </p>

          <div className="bg-white/10 p-2 rounded-md">
            <p className="font-semibold text-indigo-400">📞 Hotlines:</p>
            <p>+233 55 123 4567</p>
            <p>+233 27 765 4321</p>
          </div>

          <div className="bg-white/10 p-2 rounded-md">
            <p className="font-semibold text-indigo-400">📧 Email:</p>
            <p>support@laforgecomics.com</p>
          </div>

          <div className="bg-white/10 p-2 rounded-md">
            <p className="font-semibold text-indigo-400">🕓 Working Hours:</p>
            <p>Monday – Friday: 9:00 AM – 6:00 PM (GMT)</p>
            <p>Saturday: 10:00 AM – 4:00 PM</p>
          </div>

          <p className="text-gray-400 text-xs">
            You can also visit our <span className="text-yellow-400 cursor-pointer hover:underline">Contact Page</span> for more ways to reach us.
          </p>
        </div>
      </Modal>


      {/* Password change */}
      <Modal
        isOpen={ispassOpen}
        onClose={() => setIsPassOpen(!ispassOpen)}
        title="Update your Password"
      >
        <div>
          <label className="text-sm text-gray-400">Old Password</label>
          <input
            type="text"
            required
            onChange={e => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">New Password</label>
          <input
            type="text"
            required
            onChange={e => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Confirm Password</label>
          <input
            type="password"
            required
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#234] border border-gray-600 text-white mt-1 outline-none focus:border-yellow-500 transition"
          />
        </div>

        <div className="flex gap-1.5 mt-1.5">
          <button
            onClick={() => setIsPassOpen(!ispassOpen)}
            className="text-white bg-gray-600 cursor-pointer w-full py-2"
          >
            close
          </button>
          <button onClick={() => updatePassword(user.user?.id)}  className="text-white bg-green-400 cursor-pointer w-full py-2">
            update
          </button>
        </div>
      </Modal>

      {/* FAQ Modal (Collapsible) */}
      <Modal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        title="Frequently asked questions"
      >
        <div className="text-white">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-white/10 py-1.5 mt-2">
              <p
                className="font-bold cursor-pointer flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <ChevronRight
                  size={16}
                  className={`transition-transform ${
                    openFAQ === index ? "rotate-90" : ""
                  }`}
                />
              </p>
              {openFAQ === index && (
                <p className="bg-white/10 p-1 rounded-lg text-sm mt-1 transition-all duration-300">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </Modal>
      

      <div className="text-white text-xs text-center">
        &copy; LaForge Comics {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default Settings;
