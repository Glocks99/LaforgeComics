import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const {darkMode} = useAppContext()

  return (
    <footer className={`relative ${darkMode ? "bg-white text-gray-800" : "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-gray-300"}  w-full mt-20`}>
      {/* Decorative Image */}
      <div className="absolute right-0 sm:right-6 transform -translate-y-[60px] h-[100px] w-[100px] animate-bounce">
        <img
          src={assets.donald}
          className="w-full h-full object-contain drop-shadow-2xl"
          alt="Mascot"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 sm:grid-cols-2 gap-12 z-10 relative">
        {/* Logo & About */}
        <div>
          <div className="flex items-center gap-2 text-white text-2xl font-bold mb-4">
            <img
              src={assets.logo}
              alt="LaForge"
              className="h-10 w-10 object-contain"
            />
            <p>LaForge</p>
          </div>
          <p className="text-sm leading-relaxed">
            Your ultimate hub for comics, manga, and webtoons from every genre
            and creator around the globe. Join the adventure today!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className={`${darkMode ? "text-gray-800" : "text-white"} font-semibold mb-4 border-l-4 border-yellow-500 pl-2`}>
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {["Home", "Browse", "Genres", "Latest Updates"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-yellow-400 transition">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className={`${darkMode ? "text-gray-800" : "text-white"} font-semibold mb-4 border-l-4 border-green-500 pl-2`}>
            Resources
          </h4>
          <ul className="space-y-2 text-sm">
            {["Submit Comic", "Support", "Community", "Blog"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-green-400 transition">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h4 className={`${darkMode ? "text-gray-800" : "text-white"} font-semibold mb-4 border-l-4 border-blue-500 pl-2`}>
            Connect
          </h4>
          <div className="flex gap-4 mb-4">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-blue-400 transition"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-blue-400 transition"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-pink-400 transition"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              aria-label="Email"
              className="hover:text-yellow-400 transition"
            >
              <Mail size={20} />
            </a>
          </div>
          <p className="text-sm text-gray-400 text-wrap overflow-hidden">contact@laforgecomics.com</p>
        </div>

        {/* admin */}
        <div className="">
          <h4 className={`${darkMode ? "text-gray-800" : "text-white"} font-semibold mb-4 border-l-4 border-green-500 pl-2`}>Admin</h4>
          <a href="/admin/overview">dashboard</a>
        </div>
      </div>

      <div className="border-t border-gray-700 text-sm text-center py-5 z-10 relative">
        © {currentYear} LaForge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
