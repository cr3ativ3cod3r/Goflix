function Page1() {
  const activeMovie = {
    year: "2014",
    country: "USA",
    duration: "2h 49m",
    rating: "8.7",
    reviews: "2M reviews",
    genres: ["Adventure", "Drama", "Sci-fi"],
  };

  return (
    <div className="container max-w-screen-xl mx-auto h-screen flex flex-col justify-center items-center text-white px-6 relative">
      {/* Movie Title */}
      <h1
        className="text-9xl font-bold"
        style={{ fontFamily: "'Open Sans Condensed', sans-serif" }}
      >
        INTERSTELLAR
      </h1>

      {/* Movie Details - Always Below Title */}
      <div className="mt-6 flex flex-col items-center text-center space-y-4">
        {/* Genres */}
        <div className="flex gap-3">
          {activeMovie.genres.map((genre, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-white/10 rounded-full text-lg"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Movie Metadata */}
        <div className="text-xl text-gray-300">
          {activeMovie.country} • {activeMovie.year} • {activeMovie.duration}
        </div>
      </div>
    </div>
  );
}

export default Page1;
