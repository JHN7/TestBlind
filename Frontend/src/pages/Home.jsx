import { useState } from "react";
import SongInput from "../components/SongInput.jsx";

function Home({ onStart }) {
  const [selectedSong, setSelectedSong] = useState(null);

  // Lorsque l'utilisateur choisit une chanson dans le dropdown
  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">

      {/* Main */}
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Reverse Blind Test
        </h1>

        <p className="text-gray-400 leading-relaxed">
          Le Reverse Blind Test est un jeu musical où vous devez retrouver
          les paroles exactes d'une chanson sans l'entendre.
          Tapez les phrases ligne par ligne, validez avec Entrée,
          utilisez Shift + Entrée pour passer à la ligne.
          Chaque phrase correcte vous rapporte un point.
        </p>

        {/* Champ pour choisir la musique */}
        <div className="w-full max-w-md mx-auto mt-4">
        <SongInput onSelect={handleSongSelect} />
        </div>

        {/* Bouton lancer le jeu */}
        <button
          onClick={() => selectedSong && onStart(selectedSong)}
          className={`mt-6 px-6 py-3 rounded-xl transition 
            ${selectedSong ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-700 cursor-not-allowed"}`}
          disabled={!selectedSong} // désactive le bouton tant qu'aucune musique n'est choisie
        >
          Commencer la partie
        </button>
      </div>
    </div>
  );
}

export default Home;