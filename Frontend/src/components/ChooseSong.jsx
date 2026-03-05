import { useState, useEffect } from "react";
import axios from "axios";
import MusicInput from "../pages/Gamepage";

function ChooseSong() {
  const [song, setSong] = useState(null);
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");

  const handleStart = async () => {
    const res = await axios.get(`http://localhost:5000/lyrics?artist=${artist}&title=${title}`);
    setSong({
      title,
      artist,
      lyricsText: res.data.lyrics
    });
  };

  if (song) return <MusicInput song={song} onGameOver={() => {}} setFinalScore={() => {}} />;

  return (
    <div>
      <input value={artist} onChange={e => setArtist(e.target.value)} placeholder="Artiste" />
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre" />
      <button onClick={handleStart}>Commencer</button>
    </div>
  );
}