import React, { useState } from "react";

type Manga = {
  pdfUrl: string;
};

function MangaSearch() {
  const [title, setTitle] = useState<string>("");
  const [mangas, setMangas] = useState<Manga[]>([]);

  const fetchMangas = async () => {
    try {
      const res = await fetch(`http://api/manga/${title}`);
      const data: Manga[] = await res.json();
      setMangas(data);
    } catch (err) {
      console.error("Error al obtener manga:", err);
    }
  };

  return (
    <section>
      <h2>Buscar manga por título</h2>
      <input
        type="text"
        value={title}
        placeholder="Ej: Armados"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
      />
      <button
        className="border border-gray-500 text-black-700 hover:bg-gray-500 px-4 py-2 rounded-md"
        onClick={fetchMangas}
      >
        Buscar
      </button>
      <ul>
        {mangas.map((m, i) => (
          <li key={i}>
            <a href={m.pdfUrl} target="_blank" rel="noreferrer">
              Leer Manga
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MangaSearch;
