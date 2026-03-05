// src/components/SongInput.jsx
import { useState } from "react";

function SongInput({ onSubmit }) {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!artist.trim() || !title.trim()) return;

    // Envoie les données au parent (Home) pour démarrer le jeu
    onSubmit({ artist: artist.trim(), title: title.trim() });

    // Vide les champs
    setArtist("");
    setTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-full max-w-md mx-auto space-y-4 p-4 bg-gray-800 rounded-lg"
    >
      <input
        type="text"
        placeholder="Nom de l'artiste"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="w-full px-3 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
      />

      <input
        type="text"
        placeholder="Titre de la musique"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold w-full"
      >
        Jouer !
      </button>
    </form>
  );
}

export default SongInput;