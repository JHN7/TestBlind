import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Countdown from "./pages/Countdown";
import GamePage from "./pages/Gamepage"; // anciennement MusicInput
import Score from "./pages/Score";
import musics from "./data/musics.json";

function App() {
  const [started, setStarted] = useState(false);
  const [currentSong, setCurrentSong] = useState(null); // la musique choisie
  const [countdownDone, setCountdownDone] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleStart = ({ artist, title }) => {
    setCurrentSong({ artist, title });
    setStarted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="absolute top-6 left-8 text-2xl tracking-widest text-white select-none">
        TestBlind
      </div>

      {!started && <Home onStart={handleStart} />}
      {started && !countdownDone && <Countdown onFinish={() => setCountdownDone(true)} />}
      {started && countdownDone && !gameOver && currentSong && (
        <GamePage
          onGameOver={() => setGameOver(true)}
          setFinalScore={setFinalScore}
          song={currentSong} // <-- passe la chanson sélectionnée
        />
      )}
      {gameOver && <Score score={finalScore} total={musics[0].lyrics.length} />}
    </div>
  );
}

export default App;