import React from "react";
import ScrollElement from "./scroll_element.jsx";

const MoviePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      {/* Banner Section */}
      <div className="relative w-full h-[70vh]">
        <img
          src="https://i.ytimg.com/vi/l3HklRyAYDc/maxresdefault.jpg" 
          alt="Interstellar Banner"
          className="w-full h-full object-cover opacity-50"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
      </div>

      {/* Movie Details Section */}
      <div className="relative max-w-6xl mx-auto p-8 -mt-32">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg"
            alt="Interstellar"
            className="w-80 rounded-lg shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-5xl" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 700 }}>
              INTERSTELLAR
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, 
              Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, 
              to find a new planet for humans.
            </p>
            <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg">
              ▶ PLAY
            </button>
          </div>
        </div>

        {/* Cast Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold">Cast</h2>
          <ScrollElement />
        </div>

        {/* Crew Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold">Crew</h2>
          <ScrollElement />
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
