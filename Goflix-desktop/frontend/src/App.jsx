import { useState } from "react";
import {SplashScreen} from "./pages/SplashScreen.jsx";
import VideoShare from "./pages/SelectFolder.jsx";
import Player from "./pages/Player.jsx";


function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center">
      <SplashScreen/>
    </div>
  );
}

export default App;
