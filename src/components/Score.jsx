// src/components/Score.jsx
function Score({ score }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h2 className="text-4xl font-bold mb-4">🎉 Bravo ! 🎉</h2>
      <p className="text-2xl">Votre score final : {score}%</p>    </div>
  );
}

export default Score;