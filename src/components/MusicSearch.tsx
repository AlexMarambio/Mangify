import React, { useState } from "react";

// Tipo para una canción
type Song = {
  Title: string;
  audioUrl: string;
};

function MusicSearch() {
  const [mood, setMood] = useState<string>("");
  const [songs, setSongs] = useState<Song[]>([]);

  const fetchSongs = async () => {
    try {
      const res = await fetch(`/api/music/${mood}`);
      const data: Song[] = await res.json();
      setSongs(data);
    } catch (err) {
      console.error("Error al obtener música:", err);
    }
  };

  return (
    <section>
      <h2>Buscar música por mood</h2>
      <input
        type="text"
        value={mood}
        placeholder="Ej: drama"
        className="bg-gray-700 p-2 rounded"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMood(e.target.value)
        }
      />
      <button
        className="border border-gray-500 text-black-700 hover:bg-gray-500 px-4 py-2 rounded-md"
        onClick={fetchSongs}
      >
        Buscar
      </button>

      <ul>
        {songs.map((s, i) => (
          <li key={i}>
            <h3 className="text-lg font-medium">{s.Title}</h3>
            <audio className="p-1" controls src={s.audioUrl} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MusicSearch;
