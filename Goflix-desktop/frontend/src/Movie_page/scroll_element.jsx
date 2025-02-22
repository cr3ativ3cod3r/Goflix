import React, { useRef } from "react";
import ProfileCard from "./profile_card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ScrollElement = () => {
  const scrollRef = useRef(null);

  const profiles = [
    { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Matthew McConaughey", role: "Cooper" },
    { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Anne Hathaway", role: "Brand" },
    { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Jessica Chastain", role: "Murph" },
    { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Michael Caine", role: "Professor Brand" },
    { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Michael Caine", role: "Professor Brand" },
    { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Michael Caine", role: "Professor Brand" },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Left Scroll Button */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-full text-white z-10"
        onClick={() => scroll("left")}
      >
        <ChevronLeft size={30} />
      </button>

      {/* Scrollable Cast List */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar px-10"
        style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
      >
        {profiles.map((profile, index) => (
          <div
            key={index}
            className={`flex-shrink-0 transition-all duration-300 ${
              index === 0 ? "w-48 h-64" : "w-40 h-56 scale-90"
            }`}
          >
            <ProfileCard {...profile} />
          </div>
        ))}
      </div>

      {/* Right Scroll Button */}
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-full text-white z-10"
        onClick={() => scroll("right")}
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
};

export default ScrollElement;
