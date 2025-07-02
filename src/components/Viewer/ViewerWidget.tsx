import { useEffect, useState, useRef } from "react";
import PDFFrame from "../PDFFrame";
import { usePageAudio } from "./AudioServer";
import defaultComicDataJson from "./comic-latest.json";
import { Stage, Layer, Line } from "react-konva";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Volume2, VolumeOff } from "lucide-react"; // Asegúrate de tener lucide-react instalado

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

export interface ComicData {
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
  pdfUrl: string;
}

export default function ViewerWidget({ pdfUrl }: ViewerWidgetProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [comicData, setComicData] = useState<ComicData | null>(null);

  useEffect(() => {
    // Intentar cargar desde localStorage
    const local = localStorage.getItem("comic-latest");
    if (local) {
      try {
        setComicData(JSON.parse(local));
        return;
      } catch (e) {
        console.error("Error al parsear comic-latest de localStorage", e);
      }
    }
    // Si no hay en localStorage, usar el import por defecto
    setComicData(defaultComicDataJson as ComicData);
  }, []);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.5);
  const [currentPanel, setCurrentPanel] = useState<number>(1);
  const [fadingPanel, setFadingPanel] = useState<number | null>(null);
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const [showAudioPanel, setShowAudioPanel] = useState(false);
  const [totalPagesPanel, setTotalPanel] = useState<number>(0);
  const [totalCurrentPanel, setTotalCurrentPanel] = useState<number>(0);
  const pageConfig = comicData?.pages[currentPage.toString()];
  const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());

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
  const [visiblePage, setVisiblePage] = useState(currentPage); // se usa para mostrar la página actual
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  //const pageConfig = config.pages.find((p) => p.page === currentPage);
  const { toggleAudio, isPaused } = usePageAudio(volume);
  const [isPageLoading, setIsPageLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsPageLoading(false); // <- página lista
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
    if (!comicData) return;
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
  }, [currentChapter, comicData]);

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

  // Reinicia el estado de las figuras al cambiar de página
  useEffect(() => {
    // Reinicia el estado de las figuras al cambiar de página
    if (!panelProgress[currentPage]) {
      setCurrentPanel(1);
      setPanelProgress((prevProgress) => ({
        ...prevProgress,
        [currentPage]: 1,
      }));

      // Forzar renderizado de todas las figuras
      const shapes = getCurrentShapes();
      if (shapes.length > 0) {
        setFadingPanel(null);
        setFadeOpacity(1);
      }
    }
  }, [currentPage]);

  // Obtiene las figuras para la página actual
  const getCurrentShapes = (page: number = currentPage): ComicShape[] => {
    try {
      if (!comicData) return [];
      const pageShapes = comicData.pages[page.toString()];
      return pageShapes ?? [];
    } catch (error) {
      console.error("Error al obtener formas:", error);
      return [];
    }
  };

  const getNumberOfShapes = (page: number): number => {
    if (!comicData) return 0;
    try {
      const pageShapes = comicData.pages[page.toString()];
      return pageShapes ? pageShapes.length : 0;
    } catch (error) {
      console.error("Error al obtener el número de formas:", error);
      return 0;
    }
  };

  const [moodMusicMap, setMoodMusicMap] = useState<{ [mood: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchMoodMusicMap = async () => {
      try {
        const response = await fetch(
          //"https://backend.example.com/mood-music-map"
          "http://localhost:3001/musicFull"
        ); // el mood debe venir /public/...
        const data = await response.json();
        setMoodMusicMap(data);
      } catch (error) {
        console.error(
          "Error al obtener las rutas de música desde el backend:",
          error
        );
      }
    };

    fetchMoodMusicMap();
  }, []);

  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0;
      }
    };
  }, [audioInstance]);

  const playMoodMusic = (mood: string) => {
    if (currentMood === mood) return; // No cambiar música si el mood es el mismo

    const audioUrl = moodMusicMap[mood];
    if (audioUrl) {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0;
      }

      const newAudio = new Audio(audioUrl);
      newAudio.volume = volume;
      newAudio.play();
      setAudioInstance(newAudio);
      setCurrentMood(mood);
    }
  };

  useEffect(() => {
    if (comicData && currentPanel) {
      const currentShape = getCurrentShapes()[currentPanel - 1];
      if (currentShape) {
        const node = comicData.nodes.find((n) => n.id === currentShape.node);
        if (node) {
          playMoodMusic(node.mood);
        }
      }
    }
  }, [currentPanel, comicData]);

  useEffect(() => {
    if (audioInstance) {
      audioInstance.volume = volume; // Actualiza el volumen dinámicamente
    }
  }, [volume, audioInstance]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  if (!comicData) return <div>Cargando cómic...</div>;

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
        <div
          style={{
            width: "100%",
            height: stageHeight || 688, // Fija la altura
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              transition: "opacity 0.3s ease-in-out",
              opacity: isTransitioning ? 0 : 1,
            }}
          >
            <PDFFrame
              pdfUrl={pdfUrl}
              pageNumber={visiblePage}
              onDocumentLoadSuccess={onDocumentLoadSuccess}
              onSizeChange={({ width, height }) => {
                setStageWidth(width);
                setStageHeight(height);
              }}
              onPageOriginalSize={({ width, height, offsetX, offsetY }) => {
                setOriginalPdfSize({ width, height, offsetX, offsetY });
              }}
            />
          </div>
        </div>

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
            {!completedPages.has(visiblePage) &&
              getCurrentShapes(visiblePage)
                .filter(
                  (_, index) =>
                    index >= currentPanel && currentPage === visiblePage
                )
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
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentPage((p) => Math.max(p - 1, 1));
              setVisiblePage((p) => Math.max(p - 1, 1));
              resetPanel();
              setPanelProgress((prevProgress) => ({
                ...prevProgress,
                [currentPage - 1]: 1,
              }));
              setIsTransitioning(false);
            }, 300); // tiempo del fade
          }}
          disabled={currentPage <= 1}
          className={currentPage <= 1 ? "cursor-not-allowed" : "cursor-pointer"}
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
            const nextPage = currentPage + 1;
            if (
              currentPanel === getNumberOfShapes(currentPage) ||
              getNumberOfShapes(currentPage) === 0
            ) {
              if (nextPage <= (numPages ?? 0)) {
                setCompletedPages((prev) => new Set(prev).add(currentPage)); // <- marcar como completada
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentPage(nextPage);
                  setVisiblePage(nextPage);
                  resetPanel();
                  setIsTransitioning(false);
                }, 300);
              }
            } else {
              // lógica para pasar al siguiente panel
              setFadingPanel(currentPanel);
              setFadeOpacity(1);

              const duration = 350;
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
              {isMuted ? (
                <VolumeOff
                  className="text-neutral-300 mr-2 cursor-pointer"
                  size={20}
                  onClick={() => {
                    if (isMuted) {
                      setVolume(previousVolume);
                      setIsMuted(false);
                    } else {
                      setPreviousVolume(volume);
                      setVolume(0);
                      setIsMuted(true);
                    }
                  }}
                />
              ) : (
                <Volume2
                  className="text-neutral-300 mr-2 cursor-pointer"
                  size={20}
                  onClick={() => {
                    if (isMuted) {
                      setVolume(previousVolume);
                      setIsMuted(false);
                    } else {
                      setPreviousVolume(volume);
                      setVolume(0);
                      setIsMuted(true);
                    }
                  }}
                />
              )}
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[volume]}
                onValueChange={([v]) => handleVolumeChange(v)}
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
