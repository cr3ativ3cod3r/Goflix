function Page2({ movie }) {
    const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/original";
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
                    <button className="mt-6 px-16 py-4 bg-blue-600 hover:bg-blue-500 text-white text-2xl font-bold rounded-lg transition-all duration-300">
                        ▶ PLAY
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-xl">{movie.rating}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}