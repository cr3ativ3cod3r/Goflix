import { useState } from "react";

let ip = "localhost:8080";
let videoId = "157336";

function Page2({ onStartPlaying }) {
    const [isPlaying, setIsPlaying] = useState(false);

    async function handlePlay() {
        try {
            let videoUrl = await window.go.main.App.ClientStreamHandler(ip, videoId);
            console.log("Stream Response:", videoUrl);
            setIsPlaying(true);

            // Pass the playing state and video URL to the parent component
            onStartPlaying(videoUrl);
        } catch (error) {
            console.error("Error starting stream:", error);
        }
    }

    return (
        <div className="container max-w-screen-xl mx-auto min-h-screen flex flex-col md:flex-row items-center justify-start text-white px-4">
            <div className="md:mr-12 w-80 flex-shrink-0">
                <img
                    src="https://images-cdn.ubuy.co.in/6352289f38bb253c44612d53-interstellar-movie-poster-24-x-36-inches.jpg"
                    alt="Interstellar"
                    className="w-full shadow-lg rounded-lg"
                />
            </div>

            <div className="flex flex-col items-start text-left max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-bold z-10" style={{ fontFamily: "'Open Sans Condensed', sans-serif" }}>
                    INTERSTELLAR
                </h1>
                <p className="mt-4 text-xl md:text-2xl text-gray-300 text-justify">
                    When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans. As they embark on a journey through a wormhole, they encounter time dilation, unknown planets, and the mysteries of deep space.
                </p>

                <button 
                    className="mt-6 px-16 py-4 bg-blue-600 hover:bg-blue-500 text-white text-2xl font-bold rounded-lg transition-all duration-300" 
                    onClick={handlePlay}
                >
                    ▶ PLAY
                </button>
            </div>
        </div>
    );
}

export default Page2;
