import { useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Player from "./pages/Player.jsx";
import VideoShare from "./pages/SelectFolder.jsx";
import ServerSelection from "./pages/ServerSelection.jsx";
import { SplashScreen } from "./pages/SplashScreen.jsx";

function App() {
    const [currentPage, setCurrentPage] = useState("splash");
    const [videoPath, setVideoPath] = useState("");
    const [mode, setMode] = useState("");
    const [movieData, setMovieData] = useState({});
    const [currentMovie, setCurrentMovie] = useState({});

    // Function to start playing
    const startPlaying = (videoUrl) => {
        setVideoPath(videoUrl);
        setCurrentPage("player");
    };

    const renderPage = () => {
        switch (currentPage) {
            case "splash":
                return <SplashScreen
                    onComplete={(selectedMode) => {
                        setMode(selectedMode);
                        if (selectedMode === "host") {
                            setCurrentPage("select");
                        } else {
                            console.log("Client mode selected - functionality coming soon");
                            setCurrentPage("select");
                        }
                    }}
                />;
            case "select":
                return mode === "host" ? (
                    <VideoShare
                        onComplete={() => setCurrentPage("home")}
                        MovieData={setMovieData}
                    />
                ) : (
                    <ServerSelection />
                );
            case "player":
                return (
                    <Player
                        videoPath={videoPath}
                        onBack={() => setCurrentPage("select")}
                    />
                );
            case "home":
                return (
                    <HomePage onSelect={(movie) => {
                        setCurrentMovie(movie);
                        setCurrentPage("movie");
                    }} data={movieData} />
                );
            case "movie":
                return (
                    <MovieDetails
                        movie={currentMovie}
                        onStartPlaying={startPlaying} // Pass function to MovieDetails
                    />
                );
            default:
                return <SplashScreen onComplete={(selectedMode) => {
                    setMode(selectedMode);
                    setCurrentPage("select");
                }} />;
        }
    };

    return (
        <div className="w-full h-screen bg-black">
            {renderPage()}
        </div>
    );
}

export default App;
