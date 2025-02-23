const MovieThumbnail = ({ image, title }) => {
  return (
    <div className="flex flex-col items-center min-w-[150px]">
      <img
        src={image}
        alt={title}
        className="w-[150px] h-[220px] object-cover shadow-lg"
      />
      <p className="mt-2 text-sm text-white">{title}</p>
    </div>
  );
};

export default MovieThumbnail;
