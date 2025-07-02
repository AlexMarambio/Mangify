import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import NavBar from "./Navbar";
import Paginas from "./Paginas";
import Musica from "./Musica";
import Manga from "./Manga";
import React, { useEffect, useState } from "react";
import { viñetasGlobal } from "./Viñetas";
import { Stage, Layer, Line, Circle, Text } from "react-konva";
import { usePageContext } from "../../context/PageContext";
// import {
//   Timeline,
//   type TimelineNode,
//   type TimelineMusic,
// } from "../Editor2/timeline";
import { Card, CardContent } from "../Timeline/Extra/card";
// ...otros imports...
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Plus, GripVertical } from "lucide-react";
import { NodeCard } from "../Timeline/NodeCard";
import { DeleteZone } from "../Timeline/DeleteZone";
import { ComicProvider, useComic } from "../Timeline/ComicContext";
import { useDragAndDrop } from "../../useDragAndDrop"; // Ajusta la ruta si es necesario
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
  const [pdfSize, setPdfSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  //creador de formas
  const [firstPoint, setFirstPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [points, setPoints] = useState<number[]>([]);
  const [shapes, setShapes] = useState<ComicShape[]>([]);
  const [chapter, setChapter] = useState<number>(1);
  const { currentPage: page } = usePageContext();
  const [panel, setPanel] = useState<number>(1);
  const { addNewNode, addPanelToNode } = useComic();

  const [activeMode, setActiveMode] = useState("nodes");

  // Efecto para sincronizar formas con la línea de tiempo
  useEffect(() => {
    if (shapes.length === 0) {
      // Si no hay formas, asegurarse de que no haya nodos en la línea de tiempo
      const event = new CustomEvent("clear-timeline");
      window.dispatchEvent(event);
    } else {
      // Si hay formas, asegurarse de que haya al menos un nodo
      const event = new CustomEvent("sync-shapes", {
        detail: { shapes },
      });
      window.dispatchEvent(event);
    }
  }, [shapes]);

  // Efecto para escuchar eventos de eliminación de viñetas
  useEffect(() => {
    const handleDeletePanel = (event: CustomEvent) => {
      const { panelId } = event.detail;
      // Eliminar la forma correspondiente de la vista
      setShapes((prevShapes) =>
        prevShapes.filter((shape) => {
          // Comparar tanto el ID como string como número para mayor compatibilidad
          return (
            shape.id.toString() !== panelId && shape.id !== parseInt(panelId)
          );
        })
      );
    };

    window.addEventListener("delete-panel", handleDeletePanel as EventListener);
    return () =>
      window.removeEventListener(
        "delete-panel",
        handleDeletePanel as EventListener
      );
  }, []);

  const isNearFirstPoint = (x: number, y: number, threshold = 10): boolean => {
    if (!firstPoint) return false;
    const dx = x - firstPoint.x;
    const dy = y - firstPoint.y;
    return Math.sqrt(dx * dx + dy * dy) <= threshold;
  };

  const handleStageClick = (e: any) => {
    const stage = e.currentTarget;
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const { x, y } = pointerPosition;

    if (!firstPoint) {
      // Primer punto
      setFirstPoint({ x, y });
    } else if (isNearFirstPoint(x, y)) {
      // Si está cerca del primero: cerrar la figura
      finishShape();
      setFirstPoint(null);
      setPoints([]); // opcional: limpiar puntos si ya terminaste
      return;
    }

    setPoints((prev) => [...prev, x, y]);
  };

  const deleteLastShape = () => {
    // Elimina la última forma del canvas
    if (shapes.length > 0) {
      setShapes((prev) => {
        const newShapes = [...prev];
        newShapes.pop();
        return newShapes;
      });
    }
    // Elimina la última viñeta (panel) del primer nodo
    if (nodes.length > 0 && nodes[0].panels.length > 0) {
      const lastPanel = nodes[0].panels[nodes[0].panels.length - 1];
      deletePanel(0, lastPanel.id);
    }
  };

  const [selectedNode, setSelectedNode] = useState(0);

  const finishShape = () => {
    if (points.length >= 6) {
      const newId = Date.now();
      const newShape: ComicShape = {
        id: newId,
        points: [...points],
        fill: "rgba(50, 50, 50, 0.99)",
        closed: true,
        metadata: {
          order: shapes.length + 1,
          chapter,
          page,
          panel: viñetasGlobal,
          createdAt: new Date().toISOString(),
        },
      };
      setShapes((prev) => [...prev, newShape]);
      setPoints([]);
      setFirstPoint(null);
      setPoints([]);
      // Usar el nodo seleccionado
      addPanelToNode(selectedNode, newId);
    }
  };

  const clearLastPoint = () => {
    setPoints((prev) => prev.slice(0, -2));
  };

  const exportComicData = () => {
    // Obtener los nodos reales del contexto del cómic
    const nodes = getNodesFromData();

    // Exportar solo los datos relevantes de los nodos
    const nodesExport = nodes.map((node) => ({
      id: node.nodeKey,
      name: `Nodo ${node.nodeIndex + 1}`,
      mood: node.musicType === "feliz" ? "happy" : "sad",
      color: node.panels[0]?.fill || "bg-emerald-500",
      start: 0,
      end: 50,
    }));

    // Organizar las formas (shapes) por páginas y asociar el nodo correcto
    const pages: { [key: string]: any[] } = {};

    shapes.forEach((shape) => {
      const pageKey = shape.metadata.page.toString();
      if (!pages[pageKey]) {
        pages[pageKey] = [];
      }

      // Buscar el nodo real al que pertenece esta viñeta
      let associatedNodeKey = null;
      for (const node of nodes) {
        if (
          node.panels.some((panel) => String(panel.id) === String(shape.id))
        ) {
          associatedNodeKey = node.nodeKey;
          break;
        }
      }

      pages[pageKey].push({
        id: shape.id,
        text: `Panel ${pages[pageKey].length + 1}`,
        order: shape.metadata.order,
        node: associatedNodeKey ?? null,
        points: shape.points,
        fill: shape.fill,
        closed: shape.closed,
      });
    });

    // Crear el objeto final del cómic
    const comicData = {
      metadata: {
        title: "Mi Cómic",
        chapter: chapter.toString(),
        author: "Tu Nombre",
        created: new Date().toISOString(),
      },
      nodes: nodesExport,
      pages,
    };

    // Copiar al portapapeles
    const jsonData = JSON.stringify(comicData, null, 2);
    navigator.clipboard.writeText(jsonData).catch((err) => {
      console.error("Error al copiar al portapapeles:", err);
    });

    // Guardar en localStorage
    localStorage.setItem('comic-latest', jsonData);

    // Descargar archivo
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "comic-latest.json";
    a.click();
    URL.revokeObjectURL(url);

    alert(`Datos del cómic exportados!\nCapítulo: ${chapter}`);
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

  const [activeTab, setActiveTab] = useState("nodos");

  // Obtenemos las funciones del contexto del cómic
  const { getNodesFromData, reorderPanels, deletePanel, comicData } =
    useComic();

  // Obtenemos las funciones y estados del hook de drag and drop
  const {
    activeId,
    activeDragType,
    overId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDragAndDrop();

  // Configuramos los sensores para el drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const nodes = getNodesFromData();
  const isDragging = activeId !== null;

  useEffect(() => {
    setShapes([]);
    setPoints([]);
    setFirstPoint(null);
  }, [pdfUrl]);

  useEffect(() => {
    const handler = () => {
      addPanelToNode(0); // Agrega viñeta al primer nodo
    };
    window.addEventListener("add-panel-to-first-node", handler);
    return () => window.removeEventListener("add-panel-to-first-node", handler);
  }, [addPanelToNode]);

  console.log(window.innerHeight, window.innerWidth);

  return (
    <div className="font-mono h-screen flex flex-col">
      <div className="h-[8%]">
        <NavBar/>
      </div>
      <Separator />
      <ResizablePanelGroup direction="horizontal" className="font-mono h-[90%]">
        <ResizablePanel defaultSize={20}>
          {/* Seleccionador de páginas */}
          <Paginas pdfUrl={pdfUrl} config={config} />
        </ResizablePanel>
        <ResizableHandle withHandle className="[&>div]:h-12"/>
        <Separator orientation="vertical" />
        <ResizableHandle withHandle className="[&>div]:h-12"/>
        <ResizablePanel className="h-full w-full" defaultSize={80}>
          <ResizablePanelGroup direction="vertical" className="w-full">
            {/* Página manga */}
            <ResizablePanel defaultSize={73}>
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={75}>
                  <div className="flex relative h-full items-center">
                    {/* CONTENEDOR RELATIVO PARA SUPERPOSICIÓN */}
                    <Manga
                      pdfUrl={pdfUrl}
                      //config={config}
                      setPdfSize={setPdfSize}
                    />
                    <Stage
                      width={455}
                      height={555}
                      margin="0 auto"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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
                                text={`${i + 1}: (${Math.round(x)},${Math.round(
                                  y
                                )})`}
                                fontSize={12}
                                fill="#333"
                              />
                            </React.Fragment>
                          );
                        })}
                      </Layer>
                    </Stage>
                  </div>
                </ResizablePanel>
                <Separator orientation="vertical"/>
                <ResizablePanel defaultSize={25}>
                  <Card className="h-full">
                    <CardContent className="flex flex-col justify-center items-center space-y-4 h-full">
                      {/* Botones para añadir viñetas y nodos */}
                      <Button onClick={addNewNode} className="w-[90%] min-h-[2.5rem] flex items-center justify-center"
                        style={{ fontSize: 'clamp(0.6rem, 2vw, 0.875rem)' }}>
                        <Plus 
                          className="mr-2 flex-shrink-0" 
                          style={{ width: 'clamp(12px, 3vw, 16px)', height: 'clamp(12px, 3vw, 16px)' }}
                        />
                        <span className="truncate">Añadir Nodo</span>
                      </Button>
                      {/* Botones */}
                      <Button
                        className="w-[90%] min-h-[2.5rem] flex items-center justify-center"
                        style={{ fontSize: 'clamp(0.6rem, 2vw, 0.875rem)'}}
                        onClick={clearLastPoint}
                      >
                        <span className="truncate">Eliminar último punto</span>
                      </Button>
                      <Button
                        className="w-[90%] min-h-[2.5rem] flex items-center justify-center"
                        style={{ fontSize: 'clamp(0.6rem, 2vw, 0.875rem)' }}
                        onClick={deleteLastShape}
                      >
                        <span className="truncate">Eliminar última forma</span>
                      </Button>
                      <Button
                        className="w-[90%] min-h-[2.5rem] flex items-center justify-center"
                        style={{ fontSize: 'clamp(0.6rem, 2vw, 0.875rem)' }}
                        onClick={exportComicData}
                      >
                        <span className="truncate">Exportar cómic</span>
                      </Button>
                      <Button 
                        onClick={clearLastPoint}
                        className="w-[90%] min-h-[2.5rem] flex items-center justify-center"
                        style={{ fontSize: 'clamp(0.6rem, 2vw, 0.875rem)' }}
                      >
                        <span className="truncate">Eliminar Punto</span>
                      </Button>
                      <Button 
                        onClick={deleteLastShape}
                        className="w-[90%] min-h-[2.5rem] flex items-center justify-center"
                        style={{ fontSize: 'clamp(0.6rem, 2vw, 0.875rem)' }}
                      >
                        <span className="truncate">Eliminar Forma</span>
                      </Button>
                      <Button 
                        onClick={exportComicData}
                        className="w-[90%] min-h-[2.5rem] flex items-center justify-center"
                        style={{ fontSize: 'clamp(0.6rem, 2vw, 0.875rem)' }}
                      >
                        <span className="truncate">Exportar</span>
                      </Button>
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle className="[&>div]:h-12"/>
            <ResizablePanel defaultSize={27} className="my-2">
              <div className="w-full overflow-hidden">
                {/* Línea de tiempo */}
                <Card className="h-full">
                  <CardContent className="overflow-y-auto pb-5">
                    <div className="max-w-full mx-auto flex flex-col">
                      {/* Contenedor principal con funcionalidad de arrastrar y soltar */}
                      <DndContext
                        sensors={sensors}
                        collisionDetection={rectIntersection}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                      >
                        {/* Lista horizontal de nodos */}
                        <div className="overflow-x-auto pb-2">
                          {nodes.length === 0 ? (
                            <div className="w-full flex justify-center items-center py-8">
                              <div className="px-8 py-6 rounded-2xl shadow-lg border-4 border-border bg-card flex flex-col items-center animate-fade-in">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-12 w-12 mb-2 text-foreground drop-shadow-lg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-xl font-bold text-foreground text-center drop-shadow-lg"></span>
                                <span className="text-base text-muted-foreground mt-1 text-center">
                                  Crea una viñeta para poder visualizar la línea
                                  de tiempo
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex space-x-6 min-w-max">
                              <SortableContext
                                items={nodes.map((_, index) => `node-${index}`)}
                                strategy={horizontalListSortingStrategy}
                              >
                                {nodes.map((node) => (
                                  <NodeCard
                                    key={`node-${node.nodeIndex}`}
                                    nodeIndex={node.nodeIndex}
                                    panels={node.panels}
                                    musicType={node.musicType}
                                    onAddPanel={addPanelToNode}
                                    onReorderPanels={reorderPanels}
                                    onDeletePanel={deletePanel}
                                    isOver={
                                      overId ===
                                      `node-droppable-${node.nodeIndex}`
                                    }
                                    selected={selectedNode === node.nodeIndex}
                                    onSelect={() => setSelectedNode(node.nodeIndex)}
                                  />
                                ))}
                              </SortableContext>
                            </div>
                          )}
                        </div>

                        {/* Zona de eliminación que aparece al arrastrar */}
                        {isDragging && (
                          <div className="fixed z-100 bottom-0 left-0 right-0 h-20 transition-all duration-300 bg-red-500/20 border-t-2 border-red-500">
                            <DeleteZone
                              isActive={isDragging}
                              dragType={activeDragType}
                            />
                          </div>
                        )}

                        {/* Vista previa del elemento que se está arrastrando */}
                        <DragOverlay>
                          {activeId && activeDragType === "panel" ? (
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-2xl border-2 border-white">
                              📄
                            </div>
                          ) : activeId && activeDragType === "node" ? (
                            <div className="bg-slate-700 p-4 rounded-lg shadow-2xl border-2 border-blue-400">
                              <div className="flex items-center space-x-2 text-white">
                                <GripVertical className="w-4 h-4" />
                                <span className="font-semibold">
                                  Nodo + Música
                                </span>
                              </div>
                            </div>
                          ) : null}
                        </DragOverlay>
                      </DndContext>

                      {/* Debug JSON output 
                      <div className="mt-8 p-4 bg-slate-900 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">JSON Output:</h3>
                        <pre className="text-sm text-slate-300 overflow-auto max-h-144">{JSON.stringify(comicData, null, 2)}</pre>
                      </div> 
                      */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Editor;
