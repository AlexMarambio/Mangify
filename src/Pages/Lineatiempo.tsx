import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
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
import { NodeCard } from "../components/Timeline/NodeCard"
import { DeleteZone } from "../components/Timeline/DeleteZone"
import { ComicProvider, useComic } from "../components/Timeline/ComicContext"
import { useDragAndDrop } from "../useDragAndDrop"

// Componente que contiene la lógica principal del editor
function ComicEditorContent() {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("nodos")
  
  // Obtenemos las funciones del contexto del cómic
  const { addNewNode, addPanelToNode, getNodesFromData, reorderPanels, deletePanel, comicData } = useComic()
  
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

  // Efecto para escuchar eventos de sincronización
  useEffect(() => {
    const handleSyncShapes = (event: CustomEvent) => {
      const { shapes } = event.detail;
      // Aquí podrías actualizar el estado de la línea de tiempo basado en las formas
      // Por ahora, solo nos aseguramos de que haya un nodo
      if (nodes.length === 0 && shapes.length > 0) {
        addNewNode();
      }
    };

    const handleClearTimeline = () => {
      // Limpiar todos los nodos de la línea de tiempo
      nodes.forEach((_, index) => {
        deletePanel(index, nodes[index].panels[0]?.id);
      });
    };

    window.addEventListener('sync-shapes', handleSyncShapes as EventListener);
    window.addEventListener('clear-timeline', handleClearTimeline);

    return () => {
      window.removeEventListener('sync-shapes', handleSyncShapes as EventListener);
      window.removeEventListener('clear-timeline', handleClearTimeline);
    };
  }, [nodes, addNewNode, deletePanel]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Contenido principal */}
      <div className="flex-1 overflow-hidden">
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
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <p className="text-lg mb-2">No hay nodos ni viñetas</p>
                <p className="text-sm">Agrega un nodo y/o viñeta para visualizar la línea de tiempo</p>
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
                      isOver={overId === `node-droppable-${node.nodeIndex}`}
                    />
                  ))}
                </SortableContext>
              </div>
            )}
          </div>

          {/* Zona de eliminación que aparece al arrastrar */}
          <DeleteZone isActive={isDragging} dragType={activeDragType} />
        </DndContext>
      </div>
    </div>
  )
}

// Componente raíz que proporciona el contexto
export default function ComicEditor() {
  return (
    <ComicProvider>
      <ComicEditorContent />
    </ComicProvider>
  )
}