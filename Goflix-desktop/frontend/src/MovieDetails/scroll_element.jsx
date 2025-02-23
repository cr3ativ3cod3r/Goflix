import React, { useRef, useEffect } from "react";
import ProfileCard from "./profile_card";

const ChevronLeft = ({ size = 30, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width={size}
        height={size}
        className={className}
    >
        <path
            fillRule="evenodd"
            d="M15.71 17.71a1 1 0 0 1-1.42 0l-5-5a1 1 0 0 1 0-1.42l5-5a1 1 0 1 1 1.42 1.42L11.41 12l4.3 4.29a1 1 0 0 1 0 1.42Z"
            clipRule="evenodd"
        />
    </svg>
);

const ChevronRight = ({ size = 30, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width={size}
        height={size}
        className={className}
    >
        <path
            fillRule="evenodd"
            d="M8.29 17.71a1 1 0 0 1 0-1.42L12.59 12l-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 0 1.42l-5 5a1 1 0 0 1-1.42 0Z"
            clipRule="evenodd"
        />
    </svg>
);

const ScrollElement = () => {
    const scrollRef = useRef(null);
    const scrollInterval = useRef(null);

    const profiles = [
        { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Matthew McConaughey", role: "Cooper" },
        { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Anne Hathaway", role: "Brand" },
        { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Jessica Chastain", role: "Murph" },
        { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Michael Caine", role: "Professor Brand" },
        { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Michael Caine", role: "Professor Brand" },
        { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Matthew McConaughey", role: "Cooper" },
        { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Anne Hathaway", role: "Brand" },
        { imageUrl: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg", name: "Jessica Chastain", role: "Murph" },
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

    // Auto-scroll logic
    useEffect(() => {
        const startAutoScroll = () => {
            scrollInterval.current = setInterval(() => {
                if (scrollRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

                    if (scrollLeft + clientWidth >= scrollWidth) {
                        // Reset to start for infinite effect
                        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                    } else {
                        scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
                    }
                }
            }, 2000); // Scroll every 2 seconds
        };

        startAutoScroll();

        return () => clearInterval(scrollInterval.current); // Cleanup on unmount
    }, []);

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
                style={{ scrollBehavior: "smooth", scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
            >
                {profiles.map((profile, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 transition-all duration-300 scroll-snap-align-start ${
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