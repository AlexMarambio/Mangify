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
import { Button } from "flowbite-react"
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

  useEffect(() => {
    const handler = () => {
      addPanelToNode(0); // Agrega viñeta al primer nodo
    };
    window.addEventListener("add-panel-to-first-node", handler);
    return () => window.removeEventListener("add-panel-to-first-node", handler);
  }, [addPanelToNode]);

  return (
      <div className="max-w-full mx-auto h-auto">
        {/* Barra superior con pestañas y botones de acción */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-1">
            {["nodos", "viñetas", "música"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  activeTab === tab ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {tab === "nodos" && "🏗️"} {tab === "viñetas" && "📋"} {tab === "música" && "🎵"} {tab}
              </button>
            ))}
          </div>

          {/* Botones para añadir viñetas y nodos */}
          <div className="flex space-x-2">
            <Button onClick={() => addPanelToNode(0)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Añadir Viñeta
            </Button>
            <Button onClick={addNewNode} className="bg-blue-600 hover:bg-blue-700">
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

        {/* Debug JSON output */}
         <div className="mt-8 p-4 bg-slate-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">JSON Output:</h3>
          <pre className="text-sm text-slate-300 overflow-auto max-h-144">{JSON.stringify(comicData, null, 2)}</pre>
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