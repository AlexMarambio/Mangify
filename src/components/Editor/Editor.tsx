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
} from "@dnd-kit/core"
import { 
  SortableContext, 
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable"
import { Plus, GripVertical } from "lucide-react"
import { NodeCard } from "../Timeline/NodeCard"
import { DeleteZone } from "../Timeline/DeleteZone"
import { ComicProvider, useComic } from "../Timeline/ComicContext"
import { useDragAndDrop } from "../../useDragAndDrop" // Ajusta la ruta si es necesario
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
      const event = new CustomEvent('clear-timeline');
      window.dispatchEvent(event);
    } else {
      // Si hay formas, asegurarse de que haya al menos un nodo
      const event = new CustomEvent('sync-shapes', { 
        detail: { shapes } 
      });
      window.dispatchEvent(event);
    }
  }, [shapes]);

  // Efecto para escuchar eventos de eliminación de viñetas
  useEffect(() => {
    const handleDeletePanel = (event: CustomEvent) => {
      const { panelId } = event.detail;
      // Eliminar la forma correspondiente de la vista
      setShapes((prevShapes) => prevShapes.filter((shape) => shape.id.toString() !== panelId));
    };

    window.addEventListener('delete-panel', handleDeletePanel as EventListener);
    return () => window.removeEventListener('delete-panel', handleDeletePanel as EventListener);
  }, []);

  const handleStageClick = (e: any) => {
    const stage = e.currentTarget;
    const pointerPosition = stage.getPointerPosition();
    if (pointerPosition) {
      const { x, y } = pointerPosition;
      setPoints((prev) => [...prev, x, y]);
    }
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

  const finishShape = () => {
    if (points.length >= 6) {
      // Mínimo 3 puntos (x,y)
      const newShape: ComicShape = {
        id: Date.now(),
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

      // Asegurarse de que haya un nodo en la línea de tiempo
      if (shapes.length === 0) {
        addNewNode();
      }
      // Agregar la viñeta al primer nodo
      addPanelToNode(0);
    }
  };

  const clearLastPoint = () => {
    setPoints((prev) => prev.slice(0, -2));
  };

 const exportComicData = () => {
  // Obtener los nodos del contexto del cómic
  const nodes = getNodesFromData().map(node => ({
    id: `node-${node.nodeIndex}`, // Asegurar que tenga id
    name: `Nodo ${node.nodeIndex + 1}`,
    mood: "neutral",
    color: "bg-blue-500",
    start:  node.nodeIndex * 60,
    end:  (node.nodeIndex * 60) + 50
  }));

  // Organizar las formas (shapes) por páginas
  const pages: { [key: string]: any[] } = {};
  
  shapes.forEach(shape => {
    const pageKey = shape.metadata.page.toString();
    if (!pages[pageKey]) {
      pages[pageKey] = [];
    }

    // Encontrar el nodo asociado a esta viñeta (simplificado - puedes mejorar esta lógica)
    const associatedNode = nodes[0]; // Por defecto al primer nodo, ajusta según tu lógica
    
    pages[pageKey].push({
      id: shape.id,
      text: `Panel ${pages[pageKey].length + 1}`,
      order: shape.metadata.order,
      node: associatedNode.id,
      points: shape.points,
      fill: shape.fill,
      closed: shape.closed
    });
  });

  // Crear el objeto final del cómic
  const comicData = {
    metadata: {
      title: "Mi Cómic",
      chapter: chapter.toString(),
      author: "Tu Nombre",
      created: new Date().toISOString()
    },
    nodes,
    pages
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
  a.download = `comic-${comicData.metadata.chapter}-${new Date().toISOString()}.json`;
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
  const [activeTab, setActiveTab] = useState("nodos")
  
  // Obtenemos las funciones del contexto del cómic
  const { getNodesFromData, reorderPanels, deletePanel, comicData } = useComic()
  
  // Obtenemos las funciones y estados del hook de drag and drop
  const { activeId, activeDragType, overId, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop()

  // Configuramos los sensores para el drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const nodes = getNodesFromData()
  const isDragging = activeId !== null

  useEffect(() => {
    const handler = () => {
      addPanelToNode(0); // Agrega viñeta al primer nodo
    };
    window.addEventListener("add-panel-to-first-node", handler);
    return () => window.removeEventListener("add-panel-to-first-node", handler);
  }, [addPanelToNode]);


  // Ajuste del tamaño de los paneles según tamaño del viewport
  const SizePanel = (component:string) => {
    const height = window.innerHeight;
    switch (component) {
      case "PaginasManga":
        if (height <= 1280) {
          return 20
        } else if (height > 1280) {
          return 30
        }
        break
      case "Musica":
        if (height <= 1280) {
          return 20
        } else if (height > 1280) {
          return 20
        }
        break
      case "MangaPanel":
        if (height <= 1280) {
          return 60
        } else if (height > 1280) {
          return 60
        }
        break
      case "ComicPanel":
        if (height <= 1280) {
          return 67
        } else if (height > 1280) {
          return 70
        }
        break
      case "LineaTiempo":
        if (height <= 1280) {
          return 33
        } else if (height > 1280) {
          return 30
        }
        break
    }
  }

  return (
    <div className="font-mono h-screen flex flex-col bg-black">
      <div className="h-[8%]">
        <NavBar />
      </div>
      <Separator/>
      <ResizablePanelGroup direction="horizontal" className="font-mono h-[90%] w-full">
        <ResizablePanel defaultSize={SizePanel("PaginasManga")}>
          {/* Seleccionador de páginas */}
          <Paginas pdfUrl={pdfUrl} config={config} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <Separator orientation="vertical"/>
        <ResizablePanel className="h-full w-full" defaultSize={SizePanel("Musica")}>
          {/* Opciones de herramientas */}
          <div className="w-full flex items-center justify-center">
            <Musica activePage={0}/>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="h-full w-full" defaultSize={SizePanel("MangaPanel")}>
          <ResizablePanelGroup direction="vertical" className="w-full">
            {/* Página manga */}
            <ResizablePanel defaultSize={SizePanel("ComicPanel")}>
              <div className="flex relative h-full items-center">
                {/* CONTENEDOR RELATIVO PARA SUPERPOSICIÓN */}
                  <Manga pdfUrl={pdfUrl} setPdfSize={setPdfSize} />

                  <Stage
                    width={600}
                    height={800}
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
            </ResizablePanel>
            <ResizableHandle withHandle />
            <Separator />
            <ResizablePanel defaultSize={SizePanel("LineaTiempo")}>
              <div className="w-full overflow-hidden">
                {/* Línea de tiempo */}
                <Card className="h-full">
                  <CardContent className="overflow-y-auto pb-5">
                    <div className="max-w-full mx-auto flex flex-col">
                      {/* Barra superior con pestañas y botones de acción */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex space-x-1">
                          <div className="p-2 h-full flex items-center justify-center gap-2 z-20">
                            {/* Botones */}
                            <Button
                              className="px-4 py-2 rounded-md transition-colors text-xs"
                              onClick={finishShape}
                            >
                              Finalizar forma
                            </Button>
                            <Button
                              className="px-4 py-2 rounded-md transition-colors text-xs"
                              onClick={clearLastPoint}
                            >
                              Eliminar último punto
                            </Button>
                            <Button
                              className="px-4 py-2 rounded-md transition-colors text-xs"
                              onClick={deleteLastShape}
                            >
                              Eliminar última forma
                            </Button>
                            <Button
                              className="px-4 py-2 rounded-md transition-colors text-xs"
                              onClick={exportComicData}
                            >
                              Exportar cómic
                            </Button>
                          </div>
                        </div>

                        {/* Botones para añadir viñetas y nodos */}
                        <div className="flex space-x-2 ">
                          <Button onClick={() => addPanelToNode(0)} className="text-xs">
                            <Plus className="w-4 h-4 mr-2" />
                            Añadir Viñeta
                          </Button>

                          <Button onClick={addNewNode} className="text-xs">
                            <Plus className="w-4 h-4 mr-2" />
                            Añadir Nodo
                          </Button>
                        </div>
                      </div>

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
                                  isOver={overId === `node-droppable-${node.nodeIndex}`}
                                />
                              ))}
                            </SortableContext>
                          </div>
                        </div>

                        {/* Zona de eliminación que aparece al arrastrar */}
                        {isDragging && (
                          <div
                            className="fixed z-50 bottom-0 left-0 right-0 h-20 transition-all duration-300 bg-red-500/20 border-t-2 border-red-500"
                          >
                            <DeleteZone isActive={isDragging} dragType={activeDragType} />
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
                                <span className="font-semibold">Nodo + Música</span>
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
        <ResizableHandle />
      </ResizablePanelGroup>
    </div>
  );
};

export default Editor;
