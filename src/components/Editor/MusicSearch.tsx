import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Buscar música</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Input
            type="text"
            value={mood}
            placeholder="Ej: drama"
            className="bg-gray-700 p-2 rounded"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMood(e.target.value)
            }
            />
          <Button
            onClick={fetchSongs}
            >
            Buscar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul>
          {songs.map((s, i) => (
            <li key={i}>
              <h3 className="text-lg font-medium">{s.Title}</h3>
              <audio className="p-1" controls src={s.audioUrl} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default MusicSearch;
