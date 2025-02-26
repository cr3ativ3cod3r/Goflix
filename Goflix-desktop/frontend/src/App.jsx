import {useEffect, useState} from "react";
import { SplashScreen } from "./pages/SplashScreen.jsx";
import VideoShare from "./pages/SelectFolder.jsx";
import Player from "./pages/Player.jsx";
import HomePage from "./pages/HomePage.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import ServerSelection from "./pages/ServerSelection.jsx";

function App() {
    const [currentPage, setCurrentPage] = useState("splash");
    const [mode, setMode] = useState("");
    const [movieData, setMovieData] = useState([]);
    const [currentMovie, setCurrentMovie] = useState({});
    const [hostServer, setServer] = useState({});
    const [playMovie, setPlayMovie] = useState("");

    useEffect(() => {
        if (hostServer && hostServer.ip && hostServer.port && mode !== "host") {
            const fetchMovieData = async () => {
                try {
                    const response = await fetch(`http://${hostServer.ip}:${hostServer.port}/client/home`);
                    if (!response.ok) {
                        throw new Error(`Server responded with status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log("Fetched movie data from server:", data);
                    setMovieData(data);
                } catch (error) {
                    console.error("Error fetching movie data:", error);

                }
            };

            fetchMovieData();
        }
    }, [hostServer, mode]);

    const renderPage = () => {
        switch (currentPage) {
            case "splash":
                return <SplashScreen
                    onComplete={(selectedMode) => {
                        setMode(selectedMode);
                        if (selectedMode === "host") {
                            setCurrentPage("select");
                        } else {
                            // Handle client mode
                            console.log("Client mode selected");
                            setCurrentPage("select");
                        }
                    }}
                />;
            case "select":
                return (
                    mode === "host" ? (
                        <VideoShare
                            MovieData={(data) => {
                                console.log("Movie Data Received:", data);
                                setMovieData(data);
                                if (data && data.length > 0) {
                                    console.log("Number of movies found:", data.length);
                                    if (data[0]) {
                                        console.log("Sample first movie:", data[0]);
                                    }
                                    setCurrentPage("home");
                                }
                            }}
                        />
                    ) : (
                        <ServerSelection onSelect={(server)=>{
                            setServer(server);
                            console.log("gotten server", server);
                            setCurrentPage("home");
                        }}/>
                    )
                );
            case "player":
                return (
                    <Player
                       server={hostServer}
                        videoid={playMovie}
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
                    <MovieDetails movie={currentMovie} onMoviePlay={(id)=>{setPlayMovie(id), setCurrentPage("player")}} />
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