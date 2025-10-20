import { Link } from "react-router-dom";

const sponsorData = [
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg",
    name: "Netflix",
    url: "https://www.netflix.com",
  },
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    name: "Microsoft",
    url: "https://www.microsoft.com",
  },
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    name: "Apple",
    url: "https://www.apple.com",
  },
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    name: "Google",
    url: "https://www.google.com",
  },
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    name: "Amazon",
    url: "https://www.amazon.com",
  },
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Meta_Platforms_Logo.svg",
    name: "Meta",
    url: "https://about.meta.com",
  },
];

const SponsorsCarousel = () => {
  return (
    <div className="relative mt-10 px-4 sm:px-10 py-12 rounded-3xl shadow-2xl backdrop-blur-md bg-white/5 border border-white/10">
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/20 to-transparent rounded-3xl pointer-events-none" />

      {/* Header */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center tracking-wide drop-shadow bg-clip-text text-white relative z-10">
        🤝 Our Sponsors & Partners
      </h2>

      {/* Carousel */}
      <div className="relative overflow-hidden h-[140px] rounded-xl bg-white/10 border border-white/10 backdrop-blur-md shadow-lg">
        <div className="flex w-max animate-marquee items-center h-full gap-16 px-6">
          {[...sponsorData, ...sponsorData].map((sponsor, index) => (
            <Link
              key={index}
              to={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Visit ${sponsor.name}`}
              className="flex flex-col items-center justify-center h-full hover:scale-110 transition-transform duration-500"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-[80px] w-auto object-contain grayscale hover:grayscale-0 transition duration-500 drop-shadow-lg"
              />
              <span className="mt-3 text-sm text-gray-200 font-medium backdrop-blur-md bg-black/30 px-3 py-1 rounded-full border border-white/10">
                {sponsor.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer text */}
      <p className="text-sm text-center text-gray-300 mt-6 relative z-10">
        Thank you to our amazing sponsors for supporting our journey!
      </p>

      <style>
        {`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default SponsorsCarousel;
