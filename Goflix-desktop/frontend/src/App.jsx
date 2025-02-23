import { useState } from "react";
import { SplashScreen } from "./pages/SplashScreen.jsx";
import VideoShare from "./pages/SelectFolder.jsx";
import Player from "./pages/Player.jsx";

function App() {
    const [currentPage, setCurrentPage] = useState("splash");
    const [videoPath, setVideoPath] = useState("");
    const [mode, setMode] = useState(""); // Add mode state for host/client

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
                            setCurrentPage("select"); // or keep at splash, depending on your needs
                        }
                    }}
                />;
            case "select":
                return (
                    mode === "host" ? (
                        <VideoShare
                            onVideoSelect={(path) => {
                                setVideoPath(path);
                                setCurrentPage("player");
                            }}
                        />
                    ) : (
                        // This could be a placeholder for client mode
                        <div className="flex items-center justify-center h-full text-white">
                            Client mode coming soon...
                        </div>
                    )
                );
            case "player":
                return (
                    <Player
                        videoPath={videoPath}
                        onBack={() => setCurrentPage("select")}
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