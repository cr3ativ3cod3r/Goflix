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