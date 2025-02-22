import { useState } from "react";
import MoviePage from "./Movie_page/Movie_page";

function App() {
  const [count, setCount] = useState(0);

  return (
    <MoviePage />
  );
}

export default App;
