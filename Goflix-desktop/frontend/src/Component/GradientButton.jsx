// components/GradientButton.jsx
export function GradientButton({ text, onClick, className = '', animationDirection = 'none' }) {
    const getAnimationClass = () => {
        switch (animationDirection) {
            case 'left':
                return 'animate-slide-left';
            case 'right':
                return 'animate-slide-right';
            default:
                return '';
        }
    };

    return (
        <button
            className={`group relative px-16 py-4 text-white font-semibold rounded-lg text-xl
        ${getAnimationClass()}
        transform hover:scale-105 active:scale-95 transition-all duration-300 ease-out
        ${className}`}
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-75 group-hover:opacity-100 blur animate-gradient-xy" />
            <span className="relative">{text}</span>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
        </button>
    );
}