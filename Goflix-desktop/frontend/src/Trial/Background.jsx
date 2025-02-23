import background from './interstellar.png';

const Background = ({ children }) => (
    <div 
        className="relative top-0 left-0 w-screen h-screen overflow-y-scroll"
        style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${background})`, 
            backgroundSize: 'cover', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }}
    >
        {/* Content */}
        <div className="relative z-10">
            {children}
        </div>
    </div>
);

export default Background;
