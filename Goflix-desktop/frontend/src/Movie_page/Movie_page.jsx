import React, { useState } from "react";
import ScrollElement from "./scroll_element.jsx";
import MovieCarousel from "./Movie_carousel.jsx"; 

const MoviePage = () => {
 const [selectedSection, setSelectedSection] = useState("Cast");


 const ChevronDownSVG = () => (
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
   </svg>
 );
 

 return (
   <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
     {/* Banner Section */}
     <div className="relative w-full h-[60vh] overflow-hidden perspective-1000">
       <div className="w-full h-full transform rotate-x-6">
         <img
           src="https://i.ebayimg.com/images/g/9SQAAOSwFFBlUQms/s-l1600.jpg"
           alt="Interstellar Banner"
           className="w-full h-full object-cover opacity-80"
         />
       </div>
       {/* Depth Edge */}
       <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-transparent to-black/50 shadow-6xl"></div>
     </div>

     {/* Movie Details Section */}
     <div className="relative max-w-6xl mx-auto px-8">
       {/* Title */}
       <h1
         className="absolute translate-x-1/2 text-9xl z-10 -mt-20"
         style={{ fontFamily: "OSCB, sans-serif" }}
       >
         INTERSTELLAR
       </h1>
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
           <p
             className="mt-20 text-2xl text-gray-300 text-justify max-w-screen-md mx-auto"
             style={{ fontFamily: "OSCL, sans-serif" }}
           >
             When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot,
             Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers,
             to find a new planet for humans.
           </p>
           <button
             className="mt-6 px-80 py-5 bg-blue-600 hover:bg-blue-500 text-white text-3xl font-bold rounded-lg"
             style={{ fontFamily: "OSCB, sans-serif" }}
           >
             ▶ PLAY
           </button>
         </div>
       </div>

       {/* Spacer div */}
       <div className="h-32"></div>

       {/* Cast/Crew Section with Dropdown */}
       <div className="border-t border-gray-800 pt-16">
         <div className="flex items-center gap-4 mb-6">
           <div className="relative">
             <select
               value={selectedSection}
               onChange={(e) => setSelectedSection(e.target.value)}
               className="appearance-none bg-transparent text-4xl font-bold pr-8 cursor-pointer focus:outline-none"
               style={{ fontFamily: "OSCB, sans-serif" }}
             >
               <option value="Cast">Cast</option>
               <option value="Crew">Crew</option>
             </select>
             <ChevronDownSVG className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" size={24} />
           </div>
         </div>
         <ScrollElement />
       </div>

       {/* Suggested Movies Section */}
       <div className="border-t border-gray-800 pt-16 mt-16">
         <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "OSCB, sans-serif" }}>
           Similar Movies
         </h2>
         <MovieCarousel />
       </div>

       {/* Extra spacing after Similar Movies */}
       <div className="h-32"></div>
     </div>
   </div>
 );
};

export default MoviePage;
