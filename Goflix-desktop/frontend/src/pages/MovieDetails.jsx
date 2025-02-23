import { useEffect, useRef } from "react";
import Page1 from "../MovieDetails/Page1.jsx";
import Page2 from "../MovieDetails/Page2.jsx";
import Page3 from "../MovieDetails/Page3.jsx";
import backgroundImage from "../assets/images/interstellar.png";

function MovieDetails({ movie }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const pages = Array.from(container.children);
        let currentIndex = 0;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const pageHeight = container.clientHeight;
            const newIndex = Math.round(scrollTop / pageHeight);

            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                container.scrollTo({
                    top: newIndex * pageHeight,
                    behavior: "smooth",
                });

                pages.forEach((page, i) => {
                    const distance = i - newIndex;
                    const rotation = distance * 20;
                    const lift = Math.abs(distance) * -50;

                    page.style.transform = `translateY(${lift}px) rotateX(${rotation}deg) scale(${1 - Math.abs(distance) * 0.1})`;
                    page.style.opacity = distance === 0 ? "1" : "0.8";
                });
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
                backgroundAttachment: "fixed",
                height: "100vh",
                overflowY: "scroll",
                scrollSnapType: "y mandatory",
            }}
        >
            <div className="page" style={{ scrollSnapAlign: "start" }}><Page1 /></div>
            <div className="page" style={{ scrollSnapAlign: "start" }}><Page2 /></div>
            <div className="page" style={{ scrollSnapAlign: "start" }}><Page3 /></div>
        </div>
    );
}

export default MovieDetails;
