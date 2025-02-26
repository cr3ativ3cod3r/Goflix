import { useEffect, useRef, useState } from "react";

// Custom SVG Icons as components
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M8 5v14l11-7z"/>
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
);

const SkipBackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
    </svg>
);

const SkipForwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
    </svg>
);

const MaximizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
);

const LanguageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
);

const SubtitlesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"/>
    </svg>
);


const VideoStreaming = ({movie_id}) => {
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [volume, setVolume] = useState(1);

    const STREAM_URL = `http://localhost:8081/stream/${movie_id}`;

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const getErrorMessage = (errorCode) => {
            switch (errorCode) {
                case 1: return "The video loading was aborted";
                case 2: return "Network error while loading the video";
                case 3: return "Error decoding the video";
                case 4: return "Video format not supported";
                default: return "Unknown error occurred";
            }
        };

        const handleError = (e) => {
            const errorDetails = {
                code: video.error?.code,
                message: getErrorMessage(video.error?.code),
                technical: video.error?.message
            };
            console.error("Video Error:", errorDetails);
            setError(errorDetails);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            setProgress((video.currentTime / video.duration) * 100);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleLoadStart = () => {
            console.log("Video: Load started");
            setError(null);
        };

        video.addEventListener("error", handleError);
        video.addEventListener("loadstart", handleLoadStart);
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("play", () => setIsPlaying(true));
        video.addEventListener("pause", () => setIsPlaying(false));

        video.src = STREAM_URL;

        return () => {
            video.removeEventListener("error", handleError);
            video.removeEventListener("loadstart", handleLoadStart);
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("play", () => setIsPlaying(true));
            video.removeEventListener("pause", () => setIsPlaying(false));
            video.src = "";
        };
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const handleSkip = (seconds) => {
        videoRef.current.currentTime += seconds;
    };

    const handleProgressClick = (e) => {
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * videoRef.current.duration;
    };

    const handleFullscreen = () => {
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    };


    return (
        <div className="flex  justify-center items-center min-h-screen min-w-full bg-neutral-800 ">
            <div className="relative w-full group">
                <video
                    ref={videoRef}
                    className="h-full min-w-full rounded-lg bg-black"
                    crossOrigin="anonymous"
                    playsInline
                >
                    Your browser does not support the video tag.
                </video>

                {/* Custom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Progress Bar */}
                    <div
                        ref={progressRef}
                        className="w-full h-1 bg-gray-600 cursor-pointer mb-4"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="h-full bg-red-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Play/Pause */}
                            <button
                                onClick={handlePlayPause}
                                className="text-white hover:text-red-500 transition-colors"
                            >
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </button>

                            {/* Skip Buttons */}
                            <button
                                onClick={() => handleSkip(-10)}
                                className="text-white hover:text-red-500 transition-colors"
                            >
                                <SkipBackIcon />
                            </button>
                            <button
                                onClick={() => handleSkip(10)}
                                className="text-white hover:text-red-500 transition-colors"
                            >
                                <SkipForwardIcon />
                            </button>

                            {/* Time Display */}
                            <span className="text-white text-sm">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-4">
                            {/* Subtitles */}
                            <button
                                onClick={() => {/* Handle subtitles */}}
                                className="text-white hover:text-red-500 transition-colors"
                            >
                                <SubtitlesIcon />
                            </button>

                            {/* Translation */}
                            <button
                                onClick={() => {/* Handle translation */}}
                                className="text-white hover:text-red-500 transition-colors"
                            >
                                <LanguageIcon />
                            </button>

                            {/* Chat */}
                            <button
                                onClick={() => setShowChat(!showChat)}
                                className="text-white hover:text-red-500 transition-colors"
                            >
                                <ChatIcon />
                            </button>

                            {/* Settings */}
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="text-white hover:text-red-500 transition-colors"
                            >
                                <SettingsIcon />
                            </button>

                            {/* Fullscreen */}
                            <button
                                onClick={handleFullscreen}
                                className="text-white hover:text-red-500 transition-colors"
                            >
                                <MaximizeIcon />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="absolute right-0 bottom-16 bg-black/90 p-4 rounded-lg text-white">
                        <div className="flex flex-col gap-2">
                            <div>
                                <label>Volume</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={(e) => {
                                        setVolume(e.target.value);
                                        videoRef.current.volume = e.target.value;
                                    }}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                )}


            </div>
            {showChat && (
                <div className=" w-[25vw] bg-black/90 p-4 text-white">
                    <h3 className="text-lg font-bold mb-4">Chat</h3>
                    {/* Add chat implementation here */}
                </div>
            )}
            {error && (
                <div className="mt-4 p-4 bg-red-500 text-white rounded-lg">
                    Error: {error.message}
                </div>
            )}
        </div>
    );
};

export default VideoStreaming;