import { useRef } from "react";
import MovieThumbnail from "./Movie_thumbnail";

const ChevronLeft = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
        {...props}
    >
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

const ChevronRight = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
        {...props}
    >
        <path d="M9 18l6-6-6-6" />
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
                <ChevronLeft />
            </button>

            <button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-full text-white"
                onClick={() => scroll("right")}
            >
                <ChevronRight />
            </button>

            {/* Scrollable Thumbnails */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar px-10"
                style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
            >
                {movies.map((movie, index) => (
                    <MovieThumbnail key={index} image={movie.image} title={movie.title} />
                ))}
            </div>
        </div>
    );
}
