import { useState } from "react";
import {SplashScreen} from "./componenets/SplashScreen.jsx";
import VideoShare from "./componenets/SelectFolder.jsx";


function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center">
      <VideoShare />
    </div>
  );
}

export default App;
