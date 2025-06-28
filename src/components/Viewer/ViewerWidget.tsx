import { useEffect, useState, useRef } from "react";
import PDFFrame from "../PDFFrame";
import { usePageAudio } from "./AudioServer";
import comicDataJson from "./comic-1-2025-06-27T23_47_14.673Z.json";
import { Stage, Layer, Line } from "react-konva";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Volume2 } from "lucide-react"; // Asegúrate de tener lucide-react instalado

//interface ComicPage {
//  [key: string]: ComicShape[]; // Las formas están agrupadas por alguna clave
//}

//interface ComicChapter {
//  [page: number]: ComicPage;
//}

interface ComicShape {
  id: number;
  text: string;
  order: number;
  node: string;
  points: number[];
  fill: string;
  closed: boolean;
}

interface ComicMetadata {
  title: string;
  chapter: string;
  author: string;
  created: string;
}

interface ComicNode {
  id: string;
  name: string;
  mood: string;
  color: string;
  start: number;
  end: number;
}

interface ComicData {
  metadata: ComicMetadata;
  nodes: ComicNode[];
  pages: {
    [pageNumber: string]: ComicShape[];
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

  const comicData: ComicData = comicDataJson;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.5);
  const [currentPanel, setCurrentPanel] = useState<number>(1);
  const [fadingPanel, setFadingPanel] = useState<number | null>(null);
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const [showAudioPanel, setShowAudioPanel] = useState(false);
  const [totalPagesPanel, setTotalPanel] = useState<number>(0);
  const [totalCurrentPanel, setTotalCurrentPanel] = useState<number>(0);
  const pageConfig = config.pages.find((p) => p.page === currentPage);
  const [panelProgress, setPanelProgress] = useState<{
    [page: number]: number;
  }>({});
  const [originalPdfSize, setOriginalPdfSize] = useState<{
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  }>({
    width: 800,
    height: 1200,
    offsetX: 0,
    offsetY: 0,
  });
  const editorWidth = 560; // <-- el ancho del PDF en el editor
  const editorHeight = 688; // <-- el alto del PDF en el editor

  //const pageConfig = config.pages.find((p) => p.page === currentPage);
  const { toggleAudio, isPaused } = usePageAudio(volume, pageConfig?.audioUrl);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(650);
  const [stageHeight, setStageHeight] = useState(650); // NUEVO
  const [currentChapter] = useState(1);

  const updateTotalPanel = () => {
    setTotalPanel((prevTotal) => prevTotal + getNumberOfShapes(currentPage));
  };

  const nextPanel = () => {
    setCurrentPanel((prevPanel) => {
      const next = prevPanel + 1;
      setPanelProgress((prevProgress) => ({
        ...prevProgress,
        [currentPage]: next,
      }));
      return next;
    });
  };
  const resetPanel = () => {
    setCurrentPanel(1);
  };

  // Carga la estructura de capítulos y páginas
  useEffect(() => {
    //const chapters = Object.keys(comicData.chapters).map(Number);
    // Removed setAvailableChapters as availableChapters is no longer used

    if (
      comicData.pages[currentChapter.toString() as keyof typeof comicData.pages]
    ) {
      const pages = Object.keys(
        comicData.pages[
          currentChapter.toString() as keyof typeof comicData.pages
        ]
      ).map(Number);
      // Removed setAvailablePages as availablePages is no longer used
    }
  }, [currentChapter]);

  useEffect(() => {
    const progress = panelProgress[currentPage] ?? 1;
    setCurrentPanel(progress);
    const updateWidth = () => {
      if (containerRef.current) {
        setStageWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [currentPage]);

  // Obtiene las figuras para la página actual
  const getCurrentShapes = (): ComicShape[] => {
    try {
      const pageShapes = comicData.pages[currentPage.toString()];
      return pageShapes ?? [];
    } catch (error) {
      console.error("Error al obtener formas:", error);
      return [];
    }
  };

  const getNumberOfShapes = (page: number): number => {
    try {
      const pageShapes = comicData.pages[page.toString()];
      return pageShapes ? pageShapes.length : 0;
    } catch (error) {
      console.error("Error al obtener el número de formas:", error);
      return 0;
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <div
        ref={containerRef}
        className="relative w-full max-w-full sm:max-w-[650px] mx-auto"
        style={{
          width: "100%",
          position: "relative",
        }}
      >
        {/* ...PDFFrame y Stage... */}
        <PDFFrame
          pdfUrl={pdfUrl}
          pageNumber={currentPage}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          onSizeChange={({ width, height }) => {
            setStageWidth(width);
            setStageHeight(height);
          }}
          onPageOriginalSize={({ width, height, offsetX, offsetY }) => {
            setOriginalPdfSize({ width, height, offsetX, offsetY });
          }}
        />

        <Stage
          width={stageWidth}
          height={stageHeight}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            background: "transparent",
            border: "1px solid #222",
            pointerEvents: "none",
          }}
        >
          <Layer>
            {getCurrentShapes()
              .filter((_, index) => index >= currentPanel)
              .map((shape, index) => {
                const shapeIndex = index + currentPanel;
                const isFading = fadingPanel === shapeIndex;
                const scaleX = stageWidth / originalPdfSize.width;
                const scaleY = stageHeight / originalPdfSize.height;
                return (
                  <Line
                    key={`${currentPage}-${shapeIndex}`}
                    points={shape.points.map(
                      (point, idx) =>
                        idx % 2 === 0
                          ? (point / editorWidth) * stageWidth * 1.23 // X
                          : (point / editorHeight) * stageHeight * 1.25 // Y
                    )}
                    fill={shape.fill}
                    closed={shape.closed}
                    stroke="#444"
                    strokeWidth={2}
                    opacity={isFading ? fadeOpacity : 1}
                  />
                );
              })}
          </Layer>
        </Stage>
      </div>

      {/* Barra de navegación y control de audio */}
      <div className="flex items-center justify-center bg-neutral-900 mt-4 py-2 rounded shadow gap-2">
        <Button
          onClick={() => {
            setCurrentPage((p) => Math.max(p - 1, 1));
          }}
          disabled={currentPage <= 1}
        >
          Anterior
        </Button>
        <span className="mx-2 text-neutral-100 font-semibold">
          Página {currentPage} de {numPages || "?"}
        </span>
        <Button
          variant="outline"
          className="mx-1 cursor-pointer"
          onClick={() => {
            if (
              currentPanel == getNumberOfShapes(currentPage) ||
              getNumberOfShapes(currentPage) === 0
            ) {
              setCurrentPage((p) =>
                Math.min(p + 1, numPages ?? Number.MAX_SAFE_INTEGER)
              );
              resetPanel();
            } else {
              setFadingPanel(currentPanel);
              setFadeOpacity(1);

              const duration = 350; // ms
              const start = performance.now();

              function animate(now: number) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                setFadeOpacity(1 - progress);

                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  nextPanel();
                  setFadingPanel(null);
                  setFadeOpacity(1);
                }
              }
              requestAnimationFrame(animate);
            }
          }}
          disabled={!!numPages && currentPage >= numPages}
        >
          Siguiente
        </Button>

        {/* Control de audio en la barra */}
        <div className="flex items-center ml-4 relative">
          {showAudioPanel && (
            <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg px-3 py-2 mr-2 transition-all animate-in fade-in slide-in-from-right-4 absolute right-12 z-10">
              <Volume2 className="text-neutral-300 mr-2" size={20} />
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[volume]}
                onValueChange={([v]) => setVolume(v)}
                className="w-24 cursor-pointer"
              />
              <span className="ml-2 text-neutral-400 text-xs w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="ml-2 text-neutral-100 cursor-pointer"
                onClick={toggleAudio}
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
              </Button>
            </div>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 shadow border border-neutral-700 cursor-pointer"
            onClick={() => setShowAudioPanel((v) => !v)}
            aria-label="Control de audio"
          >
            <Volume2 size={22} />
          </Button>
        </div>
      </div>
    </div>
  );
}
