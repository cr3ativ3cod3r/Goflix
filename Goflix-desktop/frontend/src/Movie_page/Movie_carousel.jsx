import { useRef } from "react";

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

export default function MovieCarousel() {
    const scrollRef = useRef(null);

    const movies = Array(10).fill({
        image: "https://www.originalfilmart.com/cdn/shop/products/Arrival_2016_original_film_art_e823c6c1-6f00-42c5-9a4a-74fbd7ec83a8_5000x.jpg?v=1636660813", 
        title: "Arrival",
    });

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -200 : 200,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto">
            {/* Scroll Buttons */}
            <button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-full text-white"
                onClick={() => scroll("left")}
            >
                <ChevronLeft size={30} />
            </button>

            <button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-full text-white"
                onClick={() => scroll("right")}
            >
                <ChevronRight size={30} />
            </button>

            {/* Scrollable Thumbnails */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar px-10"
                style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
            >
                {movies.map((movie, index) => (
                    <div key={index} className="flex flex-col items-center min-w-[150px]">
                        <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-[150px] h-[220px] object-cover rounded-lg shadow-lg"
                        />
                        <p className="mt-2 text-sm text-white">{movie.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
