function Home({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-xl mb-8">
        Bienvenue dans Test Blind ! Le but du jeu? On te donne le titre d'une musique ainsi que le groupe, et c'est à toi de trouver les paroles!
      </p>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600"
        onClick={onStart}
      >
        Commencer
      </button>
    </div>
  );
}

export default Home;