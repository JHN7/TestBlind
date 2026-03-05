import { useState, useEffect } from "react";

function SongInput({ onSelect }) {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSelected, setHasSelected] = useState(false);

    // Fonction pour fetcher les suggestions
    const fetchSuggestions = async (query) => {
        if (!query) return setSuggestions([]);

        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5000/search?query=${encodeURIComponent(query)}`
            );
            const data = await res.json();

            // data.songs est un tableau d'objets { title, artist, id, ... }
            setSuggestions(data.songs || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Effet pour fetch après chaque changement de value
    useEffect(() => {
        if (hasSelected) return; // 👈 on ne refetch pas après sélection

        const timeout = setTimeout(() => {
            fetchSuggestions(value);
        }, 300);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className="relative w-full max-w-md">
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    setHasSelected(false);
                    if (e.target.value === "")
                        onSelect(null); // réinitialise la sélection si le champ est vidé;
                }
                }
                placeholder="Tapez un titre de musique..."
                className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Dropdown */}
            {value && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-gray-800 text-white rounded-lg mt-1 max-h-60 overflow-y-auto border border-gray-600">
                    {suggestions.map((song) => (
                        <li
                            key={song.id}
                            className="px-4 py-2 hover:bg-blue-600 cursor-pointer"
                            onClick={() => {
                                onSelect(song);
                                setValue(`${song.title} — ${song.artist}`);
                                setSuggestions([]);
                                setHasSelected(true); // 👈 bloque le refetch
                            }}
                        >
                            {song.title} — {song.artist}
                        </li>
                    ))}
                </ul>
            )}

            {loading && <div className="absolute top-full mt-1 text-gray-400">Chargement...</div>}
        </div>
    );
}

export default SongInput;