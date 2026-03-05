import { useState, useEffect, useRef } from "react";
import musics from "../data/musics.json";

function MusicInput({ onGameOver, setFinalScore }) {
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10); // 1 minute en millisecondes
    const [foundLines, setFoundLines] = useState([]);
    const [recentLines, setRecentLines] = useState([]);
    const [isError, setIsError] = useState(false);
    const textareaRef = useRef(null); // créer la ref

    const currentMusic = musics[0];

    const cleanText = (str) =>
        str.toLowerCase().replace(/[.,!?]/g, "").trim();

    const lines = currentMusic.lyrics.map((line) => cleanText(line));

    const handleGameOver = () => {
        const percentageScore = Math.round((score / lines.length) * 100);
        if (setFinalScore) setFinalScore(percentageScore);
        onGameOver();
    };

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) {
            handleGameOver();
            return;
        }
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            const typedLines = input
                .split("\n")
                .map((line) => cleanText(line))
                .filter((line) => line.length > 0);

            let newScore = 0;
            const newFound = [];

            typedLines.forEach((line) => {
                if (line && lines.includes(line) && !foundLines.includes(line) && !newFound.includes(line)) {
                    newScore++;
                    newFound.push(line);
                }
            });
            if (newFound.length > 0) {
                setScore((prev) => prev + newScore);
                setFoundLines((prev) => [...prev, ...newFound]);
                setRecentLines(newFound);

                //Après 1 seconde on enlève le vert
                setTimeout(() => {
                    setRecentLines([]);
                }, 1000);
            } else {
                setIsError(true);

                setTimeout(() => setIsError(false), 500);
            }

            setInput(""); // on vide le champ après validation
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    return (
        <div className="flex flex-col h-screen justify-between items-center bg-gray-900 text-white p-6 max-w-6xl mx-auto w-full">
            {/* Haut : titre, artiste, timer, score */}
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-1">{currentMusic.title}</h2>
                <h3 className="text-xl mb-2">{currentMusic.artist}</h3>
                <p className="text-lg">Temps restant : {timeLeft}s</p>
                <p className="mt-2 text-lg">Score : {Math.round((score / currentMusic.lyrics.length) * 100)}%</p>
            </div>

            {/* Milieu : afficher uniquement les phrases trouvées */}
            <div className="flex-1 flex flex-col justify-start text-center space-y-2 overflow-y-auto w-full px-8">
                {currentMusic.lyrics.map((line) => {
                    const cleaned = cleanText(line);
                    const isFound = foundLines.includes(cleaned);

                    return isFound ? (
                        <p
                            key={cleaned}
                            className={`animate-fadeInUp transition-all duration-500 ${recentLines.includes(cleaned)
                                ? "text-green-400 scale-105"
                                : "text-white"
                                }`}
                        >
                            {line}
                        </p>
                    ) : null;
                })}
            </div>


            {/* Bas : champ texte */}
            <div className="w-full flex justify-center mt-4">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        e.target.style.height = "auto"; // reset hauteur
                        e.target.style.height = e.target.scrollHeight + "px"; // ajuste à la hauteur du contenu
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrivez les paroles ici, ligne par ligne. Vous pouvez retourner à la ligne avec Shift + Enter. Pour valider la sélection, appuyez sur Enter."
                    className={`border rounded-xl px-4 py-3 w-full resize-none text-center text-white transition-all duration-300 focus:outline-none focus:ring-2
                    ${isError
                            ? "border-red-500 bg-red-500/10 animate-shake"
                            : "border-gray-400 focus:ring-blue-400"
                        }`} />
            </div>
        </div>
    );
}

export default MusicInput;