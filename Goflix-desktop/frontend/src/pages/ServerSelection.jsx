import { useState, useEffect, useRef } from 'react';

export default function ServerSelection({onSelect}) {
    const [peers, setPeers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshTimerRef = useRef(null);

    const fetchPeers = async () => {
        setIsRefreshing(true);
        try {
            const peerData = await window.go.main.App.GetPeers();
            console.log("Raw peer data:", peerData);

            // Filter and format the peers with Goflix service
            const availableHosts = peerData
                .filter(peer => peer)
                .map(peer => ({
                    host: peer.host || peer.ip || "Unknown Host",
                    ip: peer.addrIPv4 || "unknown ip",
                    port: peer.port || "unknown port",
                    displayName: formatServerName(peer.host || peer.ip || "Unknown Host")
                }));

            console.log("Filtered hosts:", availableHosts);
            setPeers(availableHosts);
        } catch (err) {
            console.error("Error fetching peers:", err);
            setError(err.message || "Failed to fetch peers");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPeers();
        
        // Set up auto-refresh every 2 seconds
        refreshTimerRef.current = setInterval(fetchPeers, 2000);
        
        // Clean up interval on component unmount
        return () => {
            if (refreshTimerRef.current) {
                clearInterval(refreshTimerRef.current);
            }
        };
    }, []);

    const formatServerName = (hostname) => {
        let serverName = hostname.split('.')[0];
        serverName = serverName.replace(/[^a-zA-Z0-9-]/g, '');
        return `${serverName}'s server`;
    };

    const connectToServer = async (server) => {
        console.log("Connecting to server:", server);
        try {
            onSelect(server);
        } catch (err) {
            console.error("Connection error:", err);
            setError(`Failed to connect to ${server.displayName}: ${err.message}`);
        }
    };

    const handleManualRefresh = () => {
        setLoading(true);
        setError(null);
        fetchPeers();
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#0a0f29] to-[#020617] text-white">
            <button 
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    className="absolute top-2 right-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 
                              transition-all transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                    title="Refresh server list"
                >
                    <svg 
                        className={`w-6 h-6 text-white ${isRefreshing ? 'animate-spin' : ''}`} 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9c2.39 0 4.68.94 6.4 2.6l-2.4 2.4C14.93 7.5 13.5 7 12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5" />
                        <line x1="21" y1="3" x2="15" y2="9" />
                    </svg>
                </button>
            <div className="flex flex-col items-center space-y-2 text-center relative">
                <h1
                    className="text-8xl font-bold"
                    style={{fontFamily: "OSCB, sans-serif"}}
                >
                    Choose server
                </h1>
                <p
                    className="text-2xl text-gray-400"
                    style={{fontFamily: "OSCL, sans-serif"}}
                >
                    Available servers
                </p>
                {loading && <p className="text-xl text-blue-400 mt-4">Loading available servers...</p>}
                {error && <p className="text-xl text-red-400 mt-4">Error: {error}</p>}
                {!loading && !error && peers.length === 0 && (
                    <p className="text-xl text-yellow-400 mt-4">No servers found on your network</p>
                )}
                
                {/* Refresh button */}
                
            </div>

            <div className="ml-16 flex flex-col space-y-6">
                {peers.map((server, index) => (
                    <button
                        key={index}
                        className="w-80 h-20 text-3xl font-semibold rounded-lg bg-gradient-to-r from-[#220f60] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#220f60] transition"
                        style={{fontFamily: "OSCB, sans-serif"}}
                        onClick={() => connectToServer(server)}
                    >
                        {server.displayName}
                    </button>
                ))}
            </div>
        </div>
    );
}