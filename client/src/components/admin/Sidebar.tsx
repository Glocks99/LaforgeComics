import { useState } from "react";
import {
  LayoutDashboard,
  Book,
  Users,
  FileText,
  Palette,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const navLinks = [
  { label: "overview", icon: <LayoutDashboard size={18} /> },
  { label: "comics", icon: <Book size={18} /> },
  { label: "users", icon: <Users size={18} /> },
  { label: "blogs", icon: <FileText size={18} /> },
  { label: "artists", icon: <Palette size={18} /> },
  { label: "analytics", icon: <BarChart3 size={18} /> },
];


const Sidebar = ({currentActive}:{currentActive: String}) => {
  const [active, setActive] = useState(currentActive);
  const {isMenuOpen,setIsMenuOpen, logout} = useAppContext()
  const navigate = useNavigate()

  const handleClick = (label: string) => {
    setActive(label);
    setIsMenuOpen(false) // close on mobile
    navigate("/admin/"+label)
  };

  return (
    <>
      <aside
        className={`fixed sm:relative sm:h-[100vh] bottom-0 left-0 z-50 w-full sm:w-[240px] rounded-t-2xl sm:rounded-t-none bg-gradient-to-br from-[#1a2638] to-[#234] text-white p-6 shadow-lg transform transition-transform duration-300
        ${isMenuOpen ? "translate-y-0" : "translate-y-full"} sm:translate-y-0 sm:relative sm:block`}
      >
        <h2 className="text-2xl font-bold mb-6 hidden sm:block">Admin Panel</h2>

        <nav className="space-y-2">
          {navLinks.map(({ label, icon }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => handleClick(label)}
                className={`flex items-center gap-2 w-full px-4 py-2 text-left rounded-md transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                {icon}
                <span className="capitalize text-sm">{label}</span>
              </button>
            );
          })}
        </nav>
        <button onClick={logout}  className="flex items-center gap-3 bg-red-600 w-full mt-2.5 rounded py-2.5 px-3.5">logout <LogOut size={16} /></button>
        <p className="text-xs text-center mt-1.5">&copy;{new Date().getFullYear()} <span>Laforge comics</span></p>
      </aside>
    </>
  );
};

export default Sidebar;
