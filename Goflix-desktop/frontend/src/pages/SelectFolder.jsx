import React, { useState, useRef } from 'react';
import {GradientButton} from "../Component/GradientButton.jsx";

// SVG Icon Components
const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

const FilmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
);

const WifiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
);

const VideoShare = ( onComplete, videoList ) => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [finished, setFinished] = useState(false);
    const [movieList, setMovieList] = useState([]);


    const PassFileToBackend = async () => {
        try {
            console.log("Sending videos to backend:", videos);
            const response = await window.go.main.App.AddDataHost(videos);
            setMovieList(response);
            console.log("Backend processing complete:", response);
            setFinished(true);
        } catch (error) {
            console.error("Error processing files:", error);
            setFinished(false);
        }
        if(finished){
            // onComplete(true);
            // videoList(true);
            console.log("hi this worked")
        }

    };

    const handleFolderSelect = async () => {
        try {
            const directory = await window.go.main.App.SelectDirectory()
            if (!directory) return;

            setIsLoading(true);
            setSelectedFolder(directory);

            try {
                const files = await window.go.main.App.GetVideosFromDirectory(directory);

                const discoveredVideos = await Promise.all(files.map(async file => {
                    const videoUrl = `file://${file.path}`;
                    let thumbnail;
                    try {
                        thumbnail = await generateThumbnail(videoUrl);
                    } catch (err) {
                        console.error('Error generating thumbnail:', err);
                        thumbnail = '/api/placeholder/160/90';
                    }

                    return {
                        name: file.name,
                        size: file.size,
                        path: file.path,
                        thumbnail: thumbnail
                    };
                }));

                setVideos(discoveredVideos);
            }
            catch (error) {
                console.error('Error scanning directory:', error);
            } finally {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error selecting directory:', error);
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen min-w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
                <div className="absolute w-96 h-96 -top-48 -right-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
                <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
            </div>

            <div className="relative">
                {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <div className="max-w-2xl w-full text-center space-y-8">
                            <h1 className="text-4xl font-bold text-white mb-4">Share Your Videos</h1>

                            <div className="flex justify-center space-x-6 mb-8">
                                <div className="flex items-center text-blue-400">
                                    <div className="w-6 h-6 mr-2">
                                        <WifiIcon />
                                    </div>
                                    <span>Local Network</span>
                                </div>
                                <div className="flex items-center text-purple-400">
                                    <div className="w-6 h-6 mr-2">
                                        <ShareIcon />
                                    </div>
                                    <span>Easy Sharing</span>
                                </div>
                                <div className="flex items-center text-indigo-400">
                                    <div className="w-6 h-6 mr-2">
                                        <DatabaseIcon />
                                    </div>
                                    <span>No Upload Needed</span>
                                </div>
                            </div>


                            <button
                                onClick={handleFolderSelect}
                                className="group relative px-8 py-6 w-full max-w-md mx-auto text-white rounded-xl transition-all duration-300 hover:scale-105"
                                disabled={isLoading}
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-80 group-hover:opacity-100"/>
                                <div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-75 blur animate-pulse"/>
                                <div className="relative flex flex-col items-center space-y-4">
                                    <div className="w-16 h-16">
                                        <FolderIcon/>
                                    </div>
                                    <span className="text-xl font-semibold">
                    {isLoading ? 'Scanning Videos...' : 'Select Videos Folder'}
                  </span>
                                    <p className="text-sm opacity-80">Choose the folder containing your video files</p>
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="container mx-auto py-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Available Videos</h2>
                                <p className="text-gray-400">From: {selectedFolder}</p>
                            </div>
                            <div className="flex space-x-3 ">
                                <button
                                    onClick={handleFolderSelect}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                >
                                    <span onClick={()=>{setVideos([])}}>Clear selection</span>
                                </button>
                                <GradientButton text={"Submit"} onClick={PassFileToBackend} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {videos.map((video, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-gray-800/30 rounded-lg p-2 hover:bg-gray-800/50 cursor-pointer transition-all duration-200"
                                >
                                    <img
                                        src={video.thumbnail}
                                        alt={video.name}
                                        className="w-full rounded object-cover mb-2"
                                    />
                                    <div className="text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 text-blue-400 flex-shrink-0">
                                                <FilmIcon />
                                            </div>
                                            <span className="text-white truncate">{video.name}</span>
                                        </div>
                                        <div className="text-gray-400 text-xs mt-1">{video.size}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoShare;