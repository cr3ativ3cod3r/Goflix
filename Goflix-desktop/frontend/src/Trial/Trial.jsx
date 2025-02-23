import { useEffect, useRef } from "react";
import Page1 from "./Page1.jsx";
import Page2 from "./Page2.jsx";
import Page3 from "./Page3.jsx";
import backgroundImage from "../assets/images/interstellar.png";

function Trial() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const pages = container.children;
        let currentIndex = 0;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const pageHeight = container.clientHeight;
            const newIndex = Math.round(scrollTop / pageHeight);
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                container.scrollTo({
                    top: newIndex * pageHeight,
                    behavior: "smooth"
                });

                // Apply rotation & lifting effect
                for (let i = 0; i < pages.length; i++) {
                    const distance = i - newIndex;
                    const rotation = distance * 20; // Rotation effect
                    const lift = Math.abs(distance) * -50; // Lifting effect
                    
                    pages[i].style.transform = `translateY(${lift}px) rotateX(${rotation}deg) scale(${1 - Math.abs(distance) * 0.1})`;
                    pages[i].style.opacity = distance === 0 ? "1" : "0.8"; // Fade effect
                }
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className="scroll-container"
            ref={containerRef}
            style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${backgroundImage})`, 
                backgroundSize: "cover", 
                backgroundPosition: "center", 
                backgroundAttachment: "fixed" 
            }}
        >

            <div className="page"><Page1 /></div>
            <div className="page"><Page2 /></div>
            <div className="page"><Page3 /></div>
        </div>
    );
}

export default Trial;
