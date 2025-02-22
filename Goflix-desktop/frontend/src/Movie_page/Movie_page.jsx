import React from "react";
import ScrollElement from "./scroll_element.jsx";

const MoviePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      {/* Banner Section */}
      <div className="relative w-full h-[60vh]">
        <img
          src="https://i.ytimg.com/vi/d_eGWZG_hgk/maxresdefault.jpg"
          alt="Interstellar Banner"
          className="w-full h-full object-cover opacity-40"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
        {/* Depth Edge */}
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-transparent to-black/50 shadow-2xl"></div>
      </div>
      {/* Movie Details Section */}
      <div className="relative max-w-6xl mx-auto px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster with negative margin */}
          <div className="md:-mt-48 w-80 flex-shrink-0">
            <img
              src="https://images-cdn.ubuy.co.in/6352289f38bb253c44612d53-interstellar-movie-poster-24-x-36-inches.jpg"
              alt="Interstellar"
              className="w-full shadow-lg"
            />
          </div>
          {/* Details section */}
          <div className="flex-1">
            <h1 className="text-8xl" style={{ fontFamily: "OSCB, sans-serif" }}>
              INTERSTELLAR
            </h1>
            <p className="mt-4 text-lg text-gray-300" style={{ fontFamily: "OSCL, sans-serif" }}>
              When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot,
              Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers,
              to find a new planet for humans.
            </p>
            <button
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg"
              style={{ fontFamily: "OSCB, sans-serif" }}
            >
              ▶ PLAY
            </button>
          </div>
        </div>
        {/* Cast Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "OSCB, sans-serif" }}>
            Cast
          </h2>
          <ScrollElement />
        </div>
        {/* Crew Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "OSCB, sans-serif" }}>
            Crew
          </h2>
          <ScrollElement />
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
