import { useEffect, useState } from "react";
import PDFFrame from "../PDFFrame";
import { usePageAudio } from "./AudioServer";
import comicData from "./comic-chapter-1-page-1 (2).json"; // Importa tu JSON exportado
import { Stage, Layer, Line } from "react-konva";

interface ComicShape {
  points: number[];
  fill: string;
  closed: boolean;
}

interface ComicPage {
  [key: string]: ComicShape[]; // Las formas están agrupadas por alguna clave
}

interface ComicChapter {
  [page: number]: ComicPage;
}

interface ComicData {
  chapters: {
    [chapter: number]: ComicChapter;
  };
}

interface PageConfig {
  page: number;
  audioUrl?: string;
}

export interface ViewerConfig {
  pages: PageConfig[];
}

interface ViewerWidgetProps {
  config: ViewerConfig;
  pdfUrl: string;
}

export default function ViewerWidget({ config, pdfUrl }: ViewerWidgetProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.5);

  const pageConfig = config.pages.find((p) => p.page === currentPage);

  const { toggleAudio, isPaused } = usePageAudio(volume, pageConfig?.audioUrl);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const [currentChapter, setCurrentChapter] = useState(1);
  const [availableChapters, setAvailableChapters] = useState<number[]>([]);
  const [availablePages, setAvailablePages] = useState<number[]>([]);

  // Carga la estructura de capítulos y páginas
  useEffect(() => {
    const chapters = Object.keys(comicData.chapters).map(Number);
    setAvailableChapters(chapters);

    if (
      comicData.chapters[
        currentChapter.toString() as keyof typeof comicData.chapters
      ]
    ) {
      const pages = Object.keys(
        comicData.chapters[
          currentChapter.toString() as keyof typeof comicData.chapters
        ]
      ).map(Number);
      setAvailablePages(pages);
    }
  }, [currentChapter]);

  // Obtiene las figuras para la página actual
  const getCurrentShapes = (): ComicShape[] => {
    try {
      // Verifica si existe el capítulo actual
      const chapter =
        comicData.chapters[
          currentChapter.toString() as keyof typeof comicData.chapters
        ];
      if (!chapter) return [];

      // Verifica si existe la página actual en el capítulo
      const page = chapter[currentPage.toString() as keyof typeof chapter];
      if (!page) return [];

      // Convierte los valores del objeto a un array plano de formas
      return Object.values(page).flat();
    } catch (error) {
      console.error("Error al obtener formas:", error);
      return [];
    }
  };

  return (
    <div>
      <div style={{ width: "650px", position: "relative" }}>
        <PDFFrame
          pdfUrl={pdfUrl}
          pageNumber={currentPage}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          // className="pdf-frame"
        />
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 150}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            background: "transparent", // quitar fondo blanco
            border: "none", // quitar borde
            pointerEvents: "none", // evita bloquear clics en el PDF si no necesitas interacción
          }}
        >
          <Layer>
            {getCurrentShapes().map((shape, index) => (
              <Line
                key={`${currentChapter}-${currentPage}-${index}`}
                points={shape.points.map((point) => point * 1.155)}
                fill={shape.fill}
                closed={shape.closed}
                stroke="black"
                strokeWidth={2}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <div className="bg-red-500" style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage <= 1}
        >
          Anterior
        </button>
        <span style={{ margin: "0 1rem" }}>
          Página {currentPage} de {numPages || "?"}
        </span>
        <button
          onClick={() =>
            setCurrentPage((p) =>
              Math.min(p + 1, numPages ?? Number.MAX_SAFE_INTEGER)
            )
          }
          disabled={!!numPages && currentPage >= numPages}
        >
          Siguiente
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Volumen:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
          <span>{Math.round(volume * 100)}%</span>
        </label>
        <span>
          <button onClick={toggleAudio}>{isPaused ? "Play" : "Pause"}</button>
        </span>
      </div>
    </div>
  );
}
