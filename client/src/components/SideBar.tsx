import {
  Home,
  Settings,
  LogOut,
  HeartPlus,
  User,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const SideBar = () => {
  const { isMenuOpen, setIsMenuOpen, user, logout, darkMode } =
    useAppContext();

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
