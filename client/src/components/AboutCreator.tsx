import { Twitter, Instagram, Github, Mail } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const creatorData = {
  name: "Rockson",
  image:
    "https://images.unsplash.com/photo-1603415526960-f8f0b4c9fdd4?auto=format&fit=crop&w=300&q=80",
  bio: `Hi! I'm Rockson, a passionate comic enthusiast, developer, and digital artist. 
  I built this platform to celebrate diverse storytelling through webcomics, manga, 
  and to give African creators a place to shine. When I’m not coding or drawing, 
  I’m binge-reading graphic novels and sipping iced coffee.`,
  socials: [
    { icon: <Twitter size={18} />, label: "Twitter", url: "https://twitter.com" },
    { icon: <Instagram size={18} />, label: "Instagram", url: "https://instagram.com" },
    { icon: <Github size={18} />, label: "GitHub", url: "https://github.com" },
    { icon: <Mail size={18} />, label: "Email", url: "mailto:rockson@example.com" },
  ],
};

const AboutCreator = () => {
  const {darkMode} = useAppContext()
  return (
    <div className={`relative ${darkMode ? "text-gray-800" : "bg-gradient-to-tr from-[#161d29] via-[#1e2738] to-[#24354b]"} mt-20 px-6 sm:px-12 py-14 rounded-3xl shadow-2xl overflow-hidden`}>
      {/* Floating gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12">
        {/* Creator Image with fancy frame */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-2xl blur-lg opacity-70 animate-pulse" />
          <img
            src={creatorData.image}
            alt={creatorData.name}
            className="w-44 h-44 sm:w-56 sm:h-56 object-cover rounded-2xl shadow-2xl transform hover:rotate-1 hover:scale-105 transition duration-500"
          />
        </div>

        {/* Info Section */}
        <div className="text-center md:text-left space-y-5">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 tracking-wide">
            ✨ Meet the Creator
          </h2>
          <p className={`${darkMode ? "text-gray-800" : "text-gray-200"} text-base sm:text-lg leading-relaxed max-w-2xl`}>
            {creatorData.bio}
          </p>

          {/* Social links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
            {creatorData.socials.map((social, index) => (
              <Link
                key={index}
                to={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 
                backdrop-blur-md border border-white/20 shadow-sm transition text-sm ${darkMode ? "text-gray-800" : "text-gray-200"}`}
              >
                {social.icon}
                <span className="font-medium">{social.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCreator;
