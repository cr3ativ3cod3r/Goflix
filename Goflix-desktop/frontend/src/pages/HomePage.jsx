import React, { useState, useEffect, useRef } from 'react';

const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/original";
const TMDB_POS_IMG_BASE = "https://image.tmdb.org/t/p/w500/"

const HomePage = ({data, onSelect}) => {
  const movies = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeMovie, setActiveMovie] = useState(movies?.[0] || {});
  const [hasScrolledRight, setHasScrolledRight] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!movies?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % movies.length;
        setActiveMovie(movies[newIndex]);
        return newIndex;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [movies]);

  // Your existing SVG components...
  const ArrowLeftSVG = () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
  );

  const ArrowRightSVG = () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
  );

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setActiveMovie(movies[index]);
  };

  // Scroll handlers remain the same...
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
      setHasReachedEnd(false);
      if (scrollRef.current.scrollLeft - 250 <= 0) {
        setHasScrolledRight(false);
      }
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
      setHasScrolledRight(true);

      const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      if (scrollRef.current.scrollLeft + 250 >= maxScrollLeft) {
        setHasReachedEnd(true);
      }
    }
  };

  if (!movies?.length) return <div>Loading...</div>;

  return (
      <div
          className="min-h-screen bg-black text-white relative"
          style={{
            backgroundImage: `url(${TMDB_IMG_BASE}${activeMovie.bg_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
      >
        <div className="min-h-screen bg-gradient-to-b from-black/50 to-black/90">
          <header className="p-6 flex justify-between items-center">
            <button className="text-white bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
              <ArrowLeftSVG />
            </button>
            <div className="flex items-center gap-4">
              <img
                  src="https://i.redd.it/ue84lp7yfhl81.jpg"
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
              />
            </div>
          </header>

          <div className="px-40 flex gap-8 items-end">
            <div className="w-64 h-[400px] flex-shrink-0">
              <img
                  src={`${TMDB_POS_IMG_BASE}${activeMovie.poster_path || activeMovie.bg_path}`}
                  alt={`${activeMovie.title} Poster`}
                  className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>

            <div className="flex-1 text-white flex flex-col justify-end">
              <div className="space-y-4">
                <div className="flex gap-2">
                  {activeMovie.genres?.map((genre, index) => (
                      <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {genre}
                  </span>
                  ))}
                </div>

                <h1 className="text-4xl font-bold">{activeMovie.title}</h1>
                <div className="text-sm text-gray-300">
                  {activeMovie.country} • {activeMovie.release_date?.split('-')[0]} • {activeMovie.runtime} min
                </div>

                <p className="text-gray-300 max-w-2xl min-h-[120px]">
                  {activeMovie.overview}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span>{activeMovie.rating}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                    className="px-6 py-3 bg-white text-black rounded-lg font-semibold"
                    onClick={() => onSelect(activeMovie)}
                >
                  Watch movie
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 px-40 relative">
            <h2 className="text-white px-20 text-2xl font-bold mb-4">Available movies</h2>

            <div className="relative flex items-center">
              {hasScrolledRight && (
                  <button
                      className="absolute left-10 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition"
                      onClick={scrollLeft}
                  >
                    <ArrowLeftSVG />
                  </button>
              )}

              <div
                  ref={scrollRef}
                  className="flex gap-10 px-20 overflow-x-auto pb-6 min-h-[350px] items-center scroll-smooth scrollbar-hide"
                  style={{ scrollBehavior: 'smooth', overflowX: 'auto', whiteSpace: 'nowrap' }}
              >
                {movies.map((movie, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer flex-shrink-0 relative transition-all duration-300 transform ${
                            index === currentIndex
                                ? 'scale-110 rotate-3 z-10 shadow-[0_0_15px_#ffffff80] animate-pulse'
                                : 'scale-100'
                        }`}
                        onClick={() => handleThumbnailClick(index)}
                    >
                      <img
                          src={`${TMDB_IMG_BASE}${movie.poster_path || movie.bg_path}`}
                          alt={movie.title}
                          className="w-[180px] h-[270px] object-cover rounded-lg transition-all duration-300"
                      />
                    </div>
                ))}
              </div>

              {!hasReachedEnd && (
                  <button
                      className="absolute right-10 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition"
                      onClick={scrollRight}
                  >
                    <ArrowRightSVG />
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default HomePage;