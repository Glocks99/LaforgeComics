import {
  Home,
  Settings,
  LogOut,
  HeartPlus,
  User,
  CircleQuestionMark,
  ChevronRight,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "./Modal";
import {faqData} from "../pages/Settings"

const SideBar = () => {
  const { isMenuOpen, setIsMenuOpen, user, logout, darkMode } =
    useAppContext();
   const [isFaqOpen, setIsFaqOpen] = useState(false);
   const [openFAQ, setOpenFAQ] = useState<number | null>(null);

   const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };


  const links = [
    { name: "Home", icon: <Home size={20} />, href: "/" },
    { name: "favourites", icon: <HeartPlus size={20} />, href: "/likes" },
    { name: "Profile", icon: <User size={20} />, href: "/profile" },
    { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
  ];

  return (
    <div className="block sm:hidden">
      {/* Backdrop Blur Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

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

      {/* Sidebar */}
      <div
        className={`fixed bottom-0 left-0  min-h-[50%] w-full ${darkMode ? "bg-white text-gray-800" : "bg-[#1a1f2b] text-white"} px-6 py-3 shadow-lg z-60 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-y-0" : "translate-y-full"
        } md:translate-x-0`}
      >
       
        <div className="h-[10px] flex items-center justify-center mb-6">
          <div className="h-full w-[50%] bg-[#354453] rounded-full drop-shadow-sm drop-shadow-gray-500"></div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition"
              onClick={() => setIsMenuOpen(false)} // auto close on link click
            >
              {link.icon}
              <span className="text-sm font-medium">{link.name}</span>
            </Link>
          ))}
          <button onClick={() => {
            setIsFaqOpen(true)
            setIsMenuOpen(false)
            }}  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition text-sm font-medium"><CircleQuestionMark size={20} /> FAQ</button>
        </nav>

       
        {user.isLoggedIn && (
          <div
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="border mt-5 flex items-center gap-2.5 pl-1.5 border-red-600 text-red-600 hover:bg-blue-400 hover:text-white py-2 rounded-md transition"
          >
            <LogOut />
            Logout
          </div>
        )}

        {/* Auth Buttons */}
        {!user.isLoggedIn && (
          <div className="mt-auto flex flex-col gap-3 text-sm text-center pt-10">
            <Link
              onClick={() => setIsMenuOpen(false)}
              to={"/login"}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
            >
              Login
            </Link>
            <Link
              to={"/signup"}
              className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white py-2 rounded-md transition"
            >
              Sign Up
            </Link>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-6">
          {" "}
          © {new Date().getFullYear()} LaForge. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SideBar;
