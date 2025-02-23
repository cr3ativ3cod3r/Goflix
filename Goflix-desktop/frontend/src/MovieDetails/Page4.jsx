function Page4({ movie }) {
    return (
        <div className="container max-w-screen-xl mx-auto min-h-screen flex flex-col justify-center items-center text-white px-4">
            <div className="w-full max-w-7xl pt-16">
                <h2 className="text-4xl font-bold mb-6 text-center md:text-left">
                    Similar Movies
                </h2>
                <MovieCarousel thumbnailSize="large" spacing="lg" currentMovie={movie} />
            </div>
        </div>
    );
}