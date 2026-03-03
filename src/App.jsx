import { useState } from "react";
import Home from "./components/Home";
 import Countdown from "./components/Countdown";
 import MusicInput from "./components/MusicInput";
 import Score from "./components/Score";

function App() {
  const [started, setStarted] = useState(false); // Ajout de l'état pour suivre si le jeu a commencé
  const [countdownDone, setCountdownDone] = useState(false); // Ajout de l'état pour suivre si le compte à rebours est terminé
  const [gameOver, setGameOver] = useState(false); // Ajout de l'état pour suivre si le jeu est terminé

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      {!started && <Home onStart={() => setStarted(true)} />}
      {started && !countdownDone && <Countdown onFinish={() => setCountdownDone(true)} />}
      {started && countdownDone && !gameOver && <MusicInput onGameOver={() => setGameOver(true)} />}
      {gameOver && <Score />}
    </div>
  );
}

export default App;