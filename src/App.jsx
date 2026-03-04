import { useState } from "react";
import "./App.css";
import musics from "./data/musics.json";
import Header from "./components/Header";
import Home from "./components/Home";
import Countdown from "./components/Countdown";
import MusicInput from "./components/MusicInput";
import Score from "./components/Score";

function App() {
  const [started, setStarted] = useState(false); // Ajout de l'état pour suivre si le jeu a commencé
  const [countdownDone, setCountdownDone] = useState(false); // Ajout de l'état pour suivre si le compte à rebours est terminé
  const [gameOver, setGameOver] = useState(false); // Ajout de l'état pour suivre si le jeu est terminé
  const [finalScore, setFinalScore] = useState(0); // Ajout de l'état pour stocker le score final

  return (
    <div className="bg-gray-900 text-white w-full h-screen overflow-hidden relative">
      <Header
        onClick={() => {
          setStarted(false);
          setCountdownDone(false);
          setGameOver(false);
          setFinalScore(0);
        }}
      />
      <div className="w-full h-full flex flex-col items-center justify-center pt-10">
        {!started && <Home onStart={() => setStarted(true)} />}
        {started && !countdownDone && <Countdown onFinish={() => setCountdownDone(true)} />}
        {started && countdownDone && !gameOver && (
          <MusicInput
            onGameOver={() => setGameOver(true)}
            setFinalScore={setFinalScore}
          />
        )}
        {gameOver && (
          <Score score={finalScore} total={musics[0].lyrics.length} />
        )}
      </div>
    </div>

  );
}

export default App;