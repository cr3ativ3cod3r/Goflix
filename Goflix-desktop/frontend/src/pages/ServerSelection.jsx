import { useState, useEffect } from 'react';

export default function ServerSelection({onSelect}) {
    const [peers, setPeers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPeers() {
            try {
                const peerData = await window.go.main.App.GetPeers();
                console.log("Raw peer data:", peerData);

                // Filter and format the peers with Goflix service
                // Assuming peerData is an array of objects with metadata
                const availableHosts = peerData
                    .filter(peer => peer.metadata && peer.metadata.name === "Goflix")
                    .map(peer => ({
                        host: peer.host || peer.ip || "Unknown Host",
                        ip : peer.addrIPv4 || "unknown ip",
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
            }
        }

        fetchPeers();
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

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#0a0f29] to-[#020617] text-white">
            <div className="flex flex-col items-center space-y-2 text-center">
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