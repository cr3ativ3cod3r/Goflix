import { useState } from "react";
import { SplashScreen } from "./pages/SplashScreen.jsx";
import VideoShare from "./pages/SelectFolder.jsx";
import Player from "./pages/Player.jsx";
import HomePage from "./pages/HomePage.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import ServerSelection from "./pages/ServerSelection.jsx";

function App() {
    const [currentPage, setCurrentPage] = useState("splash");
    const [videoPath, setVideoPath] = useState("");
    const [mode, setMode] = useState("");
    const [movieData, setMovieData] = useState({});
    const [currentMovie, setCurrentMovie] = useState({});

    const renderPage = () => {
        switch (currentPage) {
            case "splash":
                return <SplashScreen
                    onComplete={(selectedMode) => {
                        setMode(selectedMode);
                        if (selectedMode === "host") {
                            setCurrentPage("select");
                        } else {
                            // Handle client mode in the future
                            // For now, you could show a message or placeholder
                            console.log("Client mode selected - functionality coming soon");
                            setCurrentPage("select");
                        }
                    }}
                />;
            case "select":
                return (
                    mode === "host" ? (
                        <VideoShare
                            onComplete={() => setCurrentPage("home")}
                            MovieData={setMovieData}
                        />

                    ) : (
                        <ServerSelection/>
                    )
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
                    <MovieDetails movie={currentMovie} />
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