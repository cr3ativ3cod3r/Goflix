import React, { useState, useEffect, useRef } from 'react';

const MovieDetails = () => {
  const movies = [
    {
      title: "Interstellar",
      year: "2014",
      country: "USA",
      duration: "2h 49m",
      rating: "8.7",
      reviews: "2M reviews",
      genres: ["Adventure", "Drama", "Sci-fi"],
      description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
      poster: "https://m.media-amazon.com/images/I/61ef5BpdZTL._AC_UF1000,1000_QL80_.jpg",
      background: "https://wallpapers.com/images/featured/interstellar-d5hpgadclxszmpeh.jpg",
    },
    {
      title: "Gravity",
      year: "2013",
      country: "USA",
      duration: "1h 31m",
      rating: "7.7",
      reviews: "1.5M reviews",
      genres: ["Sci-fi", "Thriller", "Drama"],
      description: "Dr. Ryan Stone is a medical engineer on her first shuttle mission. When disaster strikes, she's tethered to veteran astronaut Matt Kowalsky as they face the void of space.",
      poster: "https://upload.wikimedia.org/wikipedia/en/f/f6/Gravity_Poster.jpg",
      background: "https://image.tmdb.org/t/p/original/tMpvEu6fTUIY6ibC12N9YPzu07g.jpg",
    },
    {
      title: "Alien",
      year: "1979",
      country: "USA",
      duration: "1h 57m",
      rating: "8.5",
      reviews: "1.8M reviews",
      genres: ["Horror", "Sci-fi"],
      description: "The crew of the commercial spacecraft Nostromo encounters a deadly alien life form after investigating an unknown transmission.",
      poster: "https://upload.wikimedia.org/wikipedia/en/c/c3/Alien_movie_poster.jpg",
      background: "https://wallpapersok.com/images/high/dark-alien-movie-nzd1as0vhtvgcphe.jpg",
    },
    
    
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeMovie, setActiveMovie] = useState(movies[0]);
  const [hasScrolledRight, setHasScrolledRight] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % movies.length;
        setActiveMovie(movies[newIndex]);
        return newIndex;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
      setHasReachedEnd(false); // Reset end state when scrolling left

      if (scrollRef.current.scrollLeft - 250 <= 0) {
        setHasScrolledRight(false); // Hide left arrow if scrolled back to the start
      }
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });

      setShowLeftArrow(true); // Show left arrow after first scroll

      const maxScrollLeft =
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      if (scrollRef.current.scrollLeft + 250 >= maxScrollLeft) {
        setShowRightArrow(false);
      }
    }
  }
  
  return (
    <div
      className="min-h-screen bg-black text-white relative"
      style={{
        backgroundImage: `url(${activeMovie.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-black/50 to-black/90">
        <header className="p-6 flex justify-between items-center">
          <button className="text-white bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
            <ArrowLeftSVG size={24} />
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
              src={activeMovie.poster}
              alt={`${activeMovie.title} Poster`}
              className="w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>

          <div className="flex-1 text-white flex flex-col justify-end">
            <div className="space-y-4">
              <div className="flex gap-2">
                {activeMovie.genres.map((genre, index) => (
                  <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-bold">{activeMovie.title}</h1>
              <div className="text-sm text-gray-300">
                {activeMovie.country} • {activeMovie.year} • {activeMovie.duration}
              </div>

              <p className="text-gray-300 max-w-2xl min-h-[120px]">
                {activeMovie.description}
              </p>
            </div>

            <div className="flex gap-4 mt-4">
              <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold">
                Watch movie
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 px-40 relative">
          <h2 className="text-white px-20 text-2xl font-bold mb-4">Available movies</h2>

          <div className="relative flex items-center">
            {/* Left arrow (Only appears after scrolling right) */}
            {hasScrolledRight && (
              <button 
                className="absolute left-10 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition" 
                onClick={scrollLeft}
              >
                <ArrowLeftSVG size={24} />
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
                    src={movie.poster}
                    alt={movie.title}
                    className="w-[180px] h-[270px] object-cover rounded-lg transition-all duration-300"
                  />
                </div>
              ))}
            </div>

            {/* Right arrow (Disappears when reaching the end) */}
            {!hasReachedEnd && (
              <button 
                className="absolute right-10 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition" 
                onClick={scrollRight}
              >
                <ArrowRightSVG size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
