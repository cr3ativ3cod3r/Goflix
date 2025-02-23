import React from "react";
import MovieCarousel from "../Movie_page/Movie_carousel.jsx"; 

function Page4() {
    return (
        <div className="container max-w-screen-xl mx-auto h-screen flex flex-col justify-center items-center text-white px-4">
            {/* Suggested Movies Section */}
            <div className="w-full max-w-7xl pt-16">
                <h2 className="text-4xl font-bold mb-6 text-center md:text-left">
                    Similar Movies
                </h2>
                <MovieCarousel thumbnailSize="large" spacing="lg" />
            </div>
        </div>
    );
}

export default Page4;
