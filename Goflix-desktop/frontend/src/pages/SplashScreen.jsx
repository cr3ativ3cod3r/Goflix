import { useEffect, useState } from "react";
import {GradientButton} from "../Component/GradientButton.jsx";

export function SplashScreen({ onComplete }) {
    const [showSplash, setShowSplash] = useState(true);
    const [loadingDots, setLoadingDots] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);

        // Animate loading dots
        const dotsInterval = setInterval(() => {
            setLoadingDots(prev => prev.length >= 3 ? "" : prev + ".");
        }, 500);

        return () => {
            clearTimeout(timer);
            clearInterval(dotsInterval);
        };
    }, []);

    const StartServer = (mode) => {
        try {
            window.go.main.App.StartBackend();
            onComplete(mode.toLowerCase()); // Call onComplete with the selected mode
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="min-h-screen min-w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            {/* Background animation */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
                <div className="absolute w-96 h-96 -top-48 -right-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
                <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
            </div>

            {showSplash ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-serif italic animate-pulse">
                        Goflix{loadingDots}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
                    {/* Logo */}
                    <div className="absolute top-8 right-8 animate-slide-down">
                        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-serif italic">
                            Goflix
                        </span>
                    </div>

                    {/* Main content */}
                    <h1 className="text-6xl font-bold text-white mb-16 animate-slide-up tracking-wider">
                        Who's Watching?
                    </h1>

                    <div className="flex gap-12">
                        {["HOST", "CLIENT"].map((text, i) => (
                            <GradientButton
                                key={text}
                                text={text}
                                onClick={() => StartServer(text)}
                                animationDirection={i === 0 ? 'left' : 'right'}
                            />
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}