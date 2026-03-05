require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Genius = require("genius-lyrics");

const app = express();
const PORT = process.env.PORT || 5000;
const Client = new Genius.Client(process.env.GENIUS_API_KEY);

app.use(cors());
app.use(express.json());

// Route test
app.get('/', (req, res) => res.send('Backend fonctionne !'));

// Recherche chansons
app.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query requise' });

    try {
        const searches = await Client.songs.search(query);
        const songs = searches.map(song => ({
            id: song.id,
            title: song.title,
            artist: song.artist.name
        }));
        res.json({ songs });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erreur recherche Genius' });
    }
});

// Récupération paroles nettoyées
app.get('/lyrics', async (req, res) => {
    const { artist, title } = req.query;
    if (!artist || !title) return res.status(400).json({ error: 'Artist et title requis' });

    try {
        const searches = await Client.songs.search(`${title} ${artist}`);
        const song = searches[0];
        if (!song) return res.status(404).json({ error: 'Paroles non trouvées' });

        let lyrics = await song.lyrics();

        // Split en lignes
        lyrics = lyrics.split("\n");

        // Supprimer le header Genius (métadonnées, contributeurs, description...)
        // Le header se termine toujours par une ligne contenant "lyrics" ou "paroles" suivie du vrai contenu
        const headerEndIndex = lyrics.findIndex((line, i) => {
            const lower = line.toLowerCase();
            // Cherche la ligne "X lyrics" ou "X paroles" qui clôture le header Genius
            return /\d+\s*contributors?/.test(lower) === false
                && i > 0
                && lyrics.slice(0, i).some(l => /contributors?/.test(l.toLowerCase()));
        });

        // Si on trouve le pattern, on cherche la vraie première ligne de paroles après le header
        // Le header Genius se termine typiquement par une ligne "Titre lyrics\n\ndescription...read more"
        const readMoreIndex = lyrics.findIndex(line => /read more/i.test(line));
        if (readMoreIndex !== -1) {
            lyrics = lyrics.slice(readMoreIndex + 1);
        } else {
            // Fallback : supprimer les N premières lignes jusqu'à la première ligne "courte" (< 80 chars)
            // qui ressemble à une vraie ligne de paroles
            const firstLyricIndex = lyrics.findIndex(line =>
                /[a-zA-Z]/.test(line) && line.length < 80 && !/contributors?|translations?/i.test(line)
            );
            lyrics = lyrics.slice(firstLyricIndex);
        }

        // Supprimer sections [Verse], [Chorus], etc. et contenus entre parenthèses
        lyrics = lyrics.map(line => line.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, ""));

        // Nettoyage ligne par ligne et suppression lignes inutiles (ooh, yeah...)
        const linesArray = lyrics
            .map(line =>
                line
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[.,!?]/g, "")
                    .replace(/\s+/g, " ")
                    .trim()
            )
            // Ne garder que lignes non vides et contenant au moins 2 lettres
            .filter(line => line.length > 1 && /[a-zA-Z]/.test(line));

        console.log("===== PAROLES NETTOYÉES POUR LE JEU =====");
        console.log(linesArray.join("\n"));
        console.log(`Total de lignes utilisées pour le jeu : ${linesArray.length}`);

        res.json({ artist, title, lyrics: linesArray });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erreur récupération des paroles' });
    }
});

app.listen(PORT, () => console.log(`Serveur backend lancé sur http://localhost:${PORT}`));