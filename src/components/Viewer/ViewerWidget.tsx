import { useEffect, useState, useRef } from "react";
import PDFFrame from "../PDFFrame";
import { usePageAudio } from "./AudioServer";
import comicData from "./comic-chapter-1-page-4 (2).json"; // Importa tu JSON exportado
import { Stage, Layer, Line } from "react-konva";

interface ComicShape {
  points: number[];
  fill: string;
  closed: boolean;
}

//interface ComicPage {
//  [key: string]: ComicShape[]; // Las formas están agrupadas por alguna clave
//}

//interface ComicChapter {
//  [page: number]: ComicPage;
//}

//interface ComicData {
//  chapters: {
//    [chapter: number]: ComicChapter;
//  };
//}

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
  const [currentPanel, setCurrentPanel] = useState<number>(1);

  const pageConfig = config.pages.find((p) => p.page === currentPage);

  const { toggleAudio, isPaused } = usePageAudio(volume, pageConfig?.audioUrl);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(650);

  const [currentChapter] = useState(1);
  // Removed unused availableChapters state
  // Removed unused availablePages state

  const nextPanel = () => {
    setCurrentPanel((prevPanel) => prevPanel + 1);
  };
  const resetPanel = () => {
    setCurrentPanel(1);
  };

  // Carga la estructura de capítulos y páginas
  useEffect(() => {
    const chapters = Object.keys(comicData.chapters).map(Number);
    // Removed setAvailableChapters as availableChapters is no longer used

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
      // Removed setAvailablePages as availablePages is no longer used
    }
  }, [currentChapter]);

  function updateWidth() {
    if (containerRef.current) {
      setStageWidth(containerRef.current.offsetWidth);
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }

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

  const getNumberOfShapes = (chapter: number, page: number): number => {
    try {
      const chapterData =
        comicData.chapters[
          chapter.toString() as keyof typeof comicData.chapters
        ];
      if (!chapterData) return 0;

      const pageData = chapterData[page.toString() as keyof typeof chapterData];
      if (!pageData) return 0;

      return Object.values(pageData).flat().length;
    } catch (error) {
      console.error("Error al obtener el número de formas:", error);
      return 0;
    }
  };

  return (
    <div>
      <div ref={containerRef} className="w-full max-w-[650px] relative mx-auto">
        <PDFFrame
          pdfUrl={pdfUrl}
          pageNumber={currentPage}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
        />
        <Stage
          width={stageWidth}
          height={stageWidth * 1.414} // relación A4, ajusta si necesitas
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            background: "transparent",
            border: "none",
            pointerEvents: "none",
          }}
        >
          <Layer>
            {getCurrentShapes()
              .filter((_, index) => index >= currentPanel)
              .map((shape, index) => (
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
      <div className="flex items-center justify-center bg-red-500 mt-4 py-2 rounded">
        <button
          className={`px-4 py-1 rounded transition-colors
    ${
      currentPage <= 1
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-white text-red-500 hover:bg-red-200 hover:text-red-700 cursor-pointer"
    }
  `}
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage((p) => p - 1);
              setCurrentPanel(1); // <-- Reinicia panel al retroceder
            }
          }}
          disabled={currentPage <= 1}
        >
          Anterior
        </button>
        <span className="mx-4 text-white font-semibold">
          Página {currentPage} de {numPages || "?"}
        </span>
        <button
          onClick={() => {
            const totalShapes = getNumberOfShapes(currentChapter, currentPage);
            if (currentPanel === totalShapes) {
              if (currentPage < (numPages ?? Number.MAX_SAFE_INTEGER)) {
                setCurrentPage((p) => p + 1);
                setCurrentPanel(1); // <-- Reinicia panel al avanzar de página
              }
            } else {
              setCurrentPanel((prevPanel) => prevPanel + 1);
            }
          }}
          className="px-4 py-1 bg-white text-red-500 rounded disabled:opacity-50 cursor-pointer hover:bg-red-200 hover:text-red-700"
          disabled={!!numPages && currentPage >= numPages}
        >
          Siguiente
        </button>
      </div>

      <div className="flex items-center justify-center mt-4 gap-4">
        <label className="flex items-center gap-2">
          <span className="font-medium">Volumen:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="accent-red-500"
          />
          <span className="w-10 text-right">{Math.round(volume * 100)}%</span>
        </label>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
          onClick={toggleAudio}
        >
          {isPaused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
