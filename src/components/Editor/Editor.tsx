import NavBar from "./Navbar";
import Paginas from "./Paginas";
import Viñetas from "./Viñetas";
import Nodos from "./Nodos";
import Musica from "./Musica";
import Manga from "./Manga";
import { useAppContext } from "../../context/AppContext";
import React, { createContext, useContext, useState } from "react";
import { Stage, Layer, Line, Circle, Text } from "react-konva";
import { usePageContext } from "../../context/PageContext";

interface ShapeMetadata {
  order: number;
  chapter: number;
  page: number;
  panel: number;
  createdAt: string;
}

interface ComicShape {
  id: number;
  points: number[];
  fill: string;
  closed: boolean;
  metadata: ShapeMetadata;
}

interface ComicChapter {
  [page: number]: {
    [panel: number]: ComicShape[];
  };
}

interface ComicData {
  metadata: {
    title: string;
    author: string;
    created: string;
  };
  chapters: {
    [chapter: number]: ComicChapter;
  };
}

const Editor = ({ pdfUrl, config }: { pdfUrl: string | null; config: any }) => {
  const { currentPage } = usePageContext();
  const { nodos, separador, musica } = useAppContext();
  console.log("PDF URL:", pdfUrl);
  console.log("Config URL:", config);

  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });

  //creador de formas
  const [points, setPoints] = useState<number[]>([]);
  const [shapes, setShapes] = useState<ComicShape[]>([]);
  const [chapter, setChapter] = useState<number>(1);
  const { currentPage: page } = usePageContext();
  const [panel, setPanel] = useState<number>(1);

  const handleStageClick = (e: any) => {
    const stage = e.currentTarget;
    const pointerPosition = stage.getPointerPosition();
    if (pointerPosition) {
      const { x, y } = pointerPosition;
      setPoints((prev) => [...prev, x, y]);
    }
  };

  const deleteLastShape = () => {
    if (shapes.length > 0) {
      setShapes((prev) => {
        const newShapes = [...prev];
        newShapes.pop();
        return newShapes;
      });
    }
  };

  const finishShape = () => {
    if (points.length >= 6) {
      // Mínimo 3 puntos (x,y)
      const newShape: ComicShape = {
        id: Date.now(),
        points: [...points],
        fill: `hsl(${Math.random() * 360}, 70%, 70%)`,
        closed: true,
        metadata: {
          order: shapes.length + 1,
          chapter,
          page,
          panel,
          createdAt: new Date().toISOString(),
        },
      };
      setShapes((prev) => [...prev, newShape]);
      setPoints([]);
    }
  };

  const clearLastPoint = () => {
    setPoints((prev) => prev.slice(0, -2));
  };

  const exportComicData = () => {
    const comicData: ComicData = {
      metadata: {
        title: "Mi Cómic",
        author: "Tu Nombre",
        created: new Date().toISOString(),
      },
      chapters: organizeByChapters(shapes),
    };

    // Copiar al portapapeles
    const jsonData = JSON.stringify(comicData, null, 2);
    navigator.clipboard.writeText(jsonData).catch((err) => {
      console.error("Error al copiar al portapapeles:", err);
    });

    // Descargar archivo
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comic-chapter-${chapter}-page-${page}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`Datos del cómic exportados!\nCapítulo: ${chapter}\nPágina: ${page}`);
  };

  const organizeByChapters = (
    shapes: ComicShape[]
  ): { [chapter: number]: ComicChapter } => {
    const chapters: { [chapter: number]: ComicChapter } = {};

    shapes.forEach((shape) => {
      const chap = shape.metadata.chapter;
      const pg = shape.metadata.page;
      const pnl = shape.metadata.panel;

      if (!chapters[chap]) chapters[chap] = {};
      if (!chapters[chap][pg]) chapters[chap][pg] = {};
      if (!chapters[chap][pg][pnl]) chapters[chap][pg][pnl] = [];

      chapters[chap][pg][pnl].push(shape);
    });

    return chapters;
  };

  return (
    <div className="font-mono h-screen flex flex-col">
      {/* NavBar */}
      <div className="h-[10%]">
        <NavBar />
      </div>
      <div className="grid grid-cols-5 h-[90%]">
        {/* Seleccionador de páginas */}
        <Paginas pdfUrl={pdfUrl} config={config} />
        {/* Opciones de herramientas */}
        <div className="col-span-1 bg-stone-900 border-r-4 border-stone-600 border-b-4">
          {separador ? <Viñetas /> : null}
          {nodos ? <Nodos /> : null}
          {musica ? <Musica /> : null}
        </div>
        {/* Página manga */}
        <div className="grid grid-rows-4 col-span-3 bg-stone-900 relative">
          <div className="row-span-3 relative border-stone-600 border-r-4">
            {/* CONTENEDOR RELATIVO PARA SUPERPOSICIÓN */}
            <div
              style={{
                position: "relative",
                width: pdfSize.width,
                height: pdfSize.height,
                margin: "0 auto", // Centra horizontalmente si quieres
              }}
            >
              <Manga pdfUrl={pdfUrl} config={config} setPdfSize={setPdfSize} />

              <Stage
                width={pdfSize.width}
                height={pdfSize.height}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  background: "transparent",
                }}
                onClick={handleStageClick}
              >
                <Layer>
                  {/* Formas completadas */}
                  {shapes
                    .filter(
                      (shape) =>
                        shape.metadata.chapter === chapter &&
                        shape.metadata.page === page
                    )
                    .map((shape) => (
                      <Line
                        key={shape.id}
                        points={shape.points}
                        fill={shape.fill}
                        closed={shape.closed}
                        stroke="black"
                        strokeWidth={2}
                      />
                    ))}

                  {/* Forma en progreso */}
                  {points.length > 1 && (
                    <Line
                      points={points}
                      stroke="red"
                      strokeWidth={2}
                      dash={[5, 5]}
                    />
                  )}

                  {/* Puntos */}
                  {Array.from({ length: points.length / 2 }).map((_, i) => {
                    const x = points[i * 2];
                    const y = points[i * 2 + 1];
                    return (
                      <React.Fragment key={`point-${i}`}>
                        <Circle x={x} y={y} radius={5} fill="red" />
                        <Text
                          x={x + 10}
                          y={y - 15}
                          text={`${i + 1}: (${Math.round(x)},${Math.round(y)})`}
                          fontSize={12}
                          fill="#333"
                        />
                      </React.Fragment>
                    );
                  })}
                </Layer>
              </Stage>
            </div>
          </div>

          <div className="row-span-1 border-t-4 border-stone-600 border-r-4 p-2 flex items-center justify-center gap-2 bg-stone-800 z-20">
            {/* Botones */}
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              onClick={finishShape}
            >
              Finalizar forma
            </button>
            <button
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
              onClick={clearLastPoint}
            >
              Eliminar último punto
            </button>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              onClick={deleteLastShape}
            >
              Eliminar última forma
            </button>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              onClick={exportComicData}
            >
              Exportar cómic
            </button>
          </div>
          <div className="row-span-1 border-t-4 border-stone-600 border-b-4 border-r-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
