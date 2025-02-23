import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieThumbnail from "./Movie_thumbnail"; 

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
          <MovieThumbnail key={index} image={movie.image} title={movie.title} />
        ))}
      </div>
    </div>
  );
}
