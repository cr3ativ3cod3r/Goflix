export default async function ServerSelection() {
    const servers = ["KEERTHAN", "SABARI", "KEERTHAN", "SABARI"];

        console.log("hellow")
        const peers = await window.go.main.App.GetPeers()

    return (
        <div
            className="flex items-center justify-center h-screen bg-gradient-to-b from-[#0a0f29] to-[#020617] text-white">
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
            </div>

            <div className="ml-16 flex flex-col space-y-6">
                {servers.map((server, index) => (
                    <button
                        key={index}
                        className="w-80 h-20 text-3xl font-semibold rounded-lg bg-gradient-to-r from-[#220f60] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#220f60] transition"
                        style={{fontFamily: "OSCB, sans-serif"}}
                        onClick={()=>{GetAvailableServers}}
                    >
                        {server}
                    </button>
                ))}
            </div>
        </div>
    );
}
  