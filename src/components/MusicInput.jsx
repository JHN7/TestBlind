// src/components/MusicInput.jsx
function MusicInput({ onGameOver }) {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl mb-4">Titre de la musique</h2>
      <input
        type="text"
        className="border rounded px-3 py-2 w-80 text-white"
        placeholder="Écris les paroles ici"
      />
      <button
        className="bg-green-500 text-white font-bold py-2 px-6 rounded hover:bg-green-600 mt-4"
        onClick={onGameOver}
      >
        Fin du jeu
      </button>
    </div>
  );
}

export default MusicInput;