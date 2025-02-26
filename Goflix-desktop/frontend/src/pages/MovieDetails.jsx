// MovieDetails.jsx
import {useEffect, useRef, useState} from "react";
import ScrollElement from "../MovieDetails/scroll_element.jsx";
import MovieCarousel from "../Home_page/Movie_carousel.jsx";


const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/original";

function MovieDetails({ movie, onMoviePlay }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const pages = Array.from(container.children);
        let currentIndex = 0;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const pageHeight = container.clientHeight;
            const newIndex = Math.round(scrollTop / pageHeight);

            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                container.scrollTo({
                    top: newIndex * pageHeight,
                    behavior: "smooth",
                });
                pages.forEach((page, i) => {
                    const distance = i - newIndex;
                    const rotation = distance * 20;
                    const lift = Math.abs(distance) * -50;
                    page.style.transform = `translateY(${lift}px) rotateX(${rotation}deg) scale(${1 - Math.abs(distance) * 0.1})`;
                    page.style.opacity = distance === 0 ? "1" : "0.8";
                });
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);
    const handlePlayMovie = () => {
        if (onMoviePlay) {
            onMoviePlay(movie.id);
        }
    };

    return (
        <div
            className="scroll-container"
            ref={containerRef}
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${TMDB_IMG_BASE}${movie.bg_path})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                height: "100vh",
                overflowY: "scroll",
                scrollSnapType: "y mandatory",
            }}
        >
            <div className="page" style={{ scrollSnapAlign: "start" }}><Page1 movie={movie} /></div>
            <div className="page" style={{ scrollSnapAlign: "start" }}><Page2 movie={movie} onMoviePlay={handlePlayMovie} /></div>
            <div className="page" style={{ scrollSnapAlign: "start" }}><Page3 movie={movie} /></div>
            <div className="page" style={{ scrollSnapAlign: "start" }}><Page4 movie={movie} /></div>
        </div>
    );
}

export default MovieDetails;

// Page1.jsx
function Page1({ movie }) {
    return (
        <div className="container max-w-screen-xl mx-auto min-h-screen flex flex-col justify-center items-center text-white px-6 relative">
            <h1
                className="text-9xl font-bold"
                style={{ fontFamily: "'Open Sans Condensed', sans-serif" }}
            >
                {movie.title.toUpperCase()}
            </h1>
            <div className="mt-6 flex flex-col items-center text-center space-y-4">
                <div className="flex gap-3">
                    {movie.genres.map((genre, index) => (
                        <span
                            key={index}
                            className="px-4 py-2 bg-white/10 rounded-full text-lg"
                        >
              {genre}
            </span>
                    ))}
                </div>
                <div className="text-xl text-gray-300">
                    {movie.country} • {movie.release_date?.split('-')[0]} • {movie.runtime} min
                </div>
            </div>
        </div>
    );
}

// Page2.jsx
function Page2({ movie, onMoviePlay }) {
    return (
        <div className="container max-w-screen-xl mx-auto min-h-screen flex flex-col md:flex-row items-center justify-start text-white px-4">
            <div className="md:mr-12 w-80 flex-shrink-0">
                <img
                    src={`${TMDB_IMG_BASE}${movie.bg_path}`}
                    alt={movie.title}
                    className="w-full shadow-lg rounded-lg"
                />
            </div>
            <div className="flex flex-col items-start text-left max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-bold z-10"
                    style={{ fontFamily: "'Open Sans Condensed', sans-serif" }}>
                    {movie.title.toUpperCase()}
                </h1>
                <p className="mt-4 text-xl md:text-2xl text-gray-300 text-justify">
                    {movie.overview}
                </p>
                <div className="flex items-center gap-4 mt-4">
                    <button className="mt-6 px-16 py-4 bg-blue-600 hover:bg-blue-500 text-white text-2xl font-bold rounded-lg transition-all duration-300" onClick={onMoviePlay}>
                        ▶ PLAY
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400">★</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Page3.jsx
function Page3({ movie }) {
    const [selectedSection, setSelectedSection] = useState("Cast");

    return (
        <div className="container max-w-screen-xl mx-auto min-h-screen flex flex-col justify-center items-center text-white px-4">
            <div className="w-full max-w-9xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="bg-transparent text-3xl font-semibold pr-8 cursor-pointer focus:outline-none appearance-none transition-all duration-300 hover:opacity-80"
                            aria-label="Select Cast or Crew"
                        >
                            <option value="Cast" className="bg-black text-white">Cast</option>
                            <option value="Crew" className="bg-black text-white">Crew</option>
                        </select>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <ScrollElement
                    section={selectedSection}
                    cast={movie.cast}
                    crew={movie.crew}
                />
            </div>
        </div>
    );
}

// Page4.jsx
function Page4({ movie }) {
    return (
        <div className="container max-w-screen-xl mx-auto min-h-screen flex flex-col justify-center items-center text-white px-4">
            <div className="w-full max-w-7xl pt-16">
                <h2 className="text-4xl font-bold mb-6 text-center md:text-left">
                    Similar Movies
                </h2>
                <MovieCarousel thumbnailSize="large" spacing="lg" currentMovie={movie} />
            </div>
        </div>
    );
}