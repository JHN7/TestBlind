import { useState, useEffect, useRef } from "react";
import axios from "axios";

function Gamepage({ onGameOver, setFinalScore, song }) {
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(2);
    const [foundIndices, setFoundIndices] = useState(new Set());
    const [recentIndices, setRecentIndices] = useState(new Set());
    const [isError, setIsError] = useState(false);
    const [lyrics, setLyrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const textareaRef = useRef(null);

    const cleanText = (str) =>
        str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[.,!?"]/g, "")
            .replace(/\s+/g, " ")
            .trim();

    useEffect(() => {
        const fetchLyrics = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:5000/lyrics", {
                    params: { artist: song.artist, title: song.title },
                });
                setLyrics(res.data.lyrics);
            } catch (err) {
                console.error("Erreur récupération des paroles :", err);
                setLyrics([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLyrics();
    }, [song]);

    useEffect(() => {
        if (loading || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, loading]);

    // Effet dédié à la fin du jeu
    useEffect(() => {
        if (timeLeft <= 0 && !loading) {
            const percentageScore = lyrics.length
                ? Math.round((score / lyrics.length) * 100)
                : 0;
            if (setFinalScore) setFinalScore(percentageScore);
            onGameOver();
        }
    }, [timeLeft, loading, lyrics, score]);// score et lyrics sont lus au bon moment ici

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            const typedLines = input
                .split("\n")
                .map(line => cleanText(line))
                .filter(Boolean);

            // ✅ Déclaration de newFoundIndices
            const newFoundIndices = new Set();

            typedLines.forEach(typedLine => {
                lyrics.forEach((lyricLine, idx) => {
                    if (
                        typedLine === lyricLine &&
                        !foundIndices.has(idx) &&
                        !newFoundIndices.has(idx)
                    ) {
                        newFoundIndices.add(idx);
                    }
                });
            });

            if (newFoundIndices.size > 0) {
                setScore(prev => prev + newFoundIndices.size);
                setFoundIndices(prev => new Set([...prev, ...newFoundIndices]));
                setRecentIndices(newFoundIndices);
                setTimeout(() => setRecentIndices(new Set()), 1000);
            } else {
                setIsError(true);
                setTimeout(() => setIsError(false), 500);
            }

            setInput("");
            if (textareaRef.current) textareaRef.current.style.height = "auto";
        }
    };

    if (loading) return <p className="text-white text-xl">Chargement des paroles...</p>;
    if (!lyrics.length) return <p className="text-white text-xl">Aucune parole trouvée pour cette chanson.</p>;

    return (
        <div className="flex flex-col h-screen justify-between items-center bg-gray-900 text-white p-6 max-w-6xl mx-auto w-full">

            <div className="text-center">
                <h2 className="text-3xl font-bold mb-1">{song.title}</h2>
                <h3 className="text-xl mb-2">{song.artist}</h3>
                <p className="text-lg">Temps restant : {timeLeft}s</p>
                <p className="mt-2 text-lg">Score : {Math.round((score / lyrics.length) * 100)}%</p>
            </div>

            <div className="flex-1 flex flex-col justify-start text-center space-y-2 overflow-y-auto w-full px-8">
                {/* ✅ Rendu complet avec les vraies classes */}
                {lyrics.map((line, idx) =>
                    foundIndices.has(idx) ? (
                        <p
                            key={idx}
                            className={`animate-fadeInUp transition-all duration-500 ${recentIndices.has(idx) ? "text-green-400 scale-105" : "text-white"
                                }`}
                        >
                            {line}
                        </p>
                    ) : null
                )}
            </div>

            <div className="w-full flex justify-center mt-4">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrivez les paroles ici, ligne par ligne. Shift + Enter pour retour à la ligne, Enter pour valider."
                    className={`border rounded-xl px-4 py-3 w-full resize-none text-center text-white transition-all duration-300 focus:outline-none focus:ring-2 ${isError ? "border-red-500 bg-red-500/10 animate-shake" : "border-gray-400 focus:ring-blue-400"
                        }`}
                />
            </div>
        </div>
    );
}

export default Gamepage;