function Home({ onStart }) {
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

        <button
          onClick={onStart}
          className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition rounded-xl"
        >
          Commencer la partie
        </button>

      </div>
    </div>
  );
}

export default Home;