import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ScrollElement from "../Movie_page/scroll_element.jsx"; 

function Page3() {
    const [selectedSection, setSelectedSection] = useState("Cast");

    return (
        <div className="container max-w-screen-xl mx-auto h-screen flex flex-col justify-center items-center text-white px-4">
            {/* Cast/Crew Section with Dropdown */}
            <div className="w-full max-w-9xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="bg-transparent text-3xl font-semibold pr-8 cursor-pointer focus:outline-none appearance-none transition-all duration-300 hover:opacity-80"
                            aria-label="Select Cast or Crew"
                        >
                            <option value="Cast" className="bg-black text-white">Cast</option>
                            <option value="Crew" className="bg-black text-white">Crew</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" size={22} />
                    </div>
                </div>
                <ScrollElement section={selectedSection} />
            </div>
        </div>
    );
}

export default Page3;
