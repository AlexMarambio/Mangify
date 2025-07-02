import React from "react"
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, useDroppable
} from "@dnd-kit/core"
import { 
  SortableContext, 
  horizontalListSortingStrategy, 
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { Music, Plus } from "lucide-react"
import { SortablePanel } from "./SortablePanel"
import { DragHandle } from "./DragHandle"
import { type NodeCardProps } from "../../timeline"
import { useComic } from "./ComicContext"

export function NodeCard({ nodeIndex, panels, musicType, onAddPanel, onReorderPanels, onDeletePanel, isOver, selected, onSelect }: NodeCardProps & { selected?: boolean, onSelect?: () => void }) {
  const { updateMusicType } = useComic();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Sortable for node reordering
  const {
    attributes: sortableAttributes,
    listeners: sortableListeners,
    setNodeRef: setSortableNodeRef,
    transform: sortableTransform,
    transition: sortableTransition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: `node-${nodeIndex}`,
    data: {
      type: "node",
      nodeIndex,
      panels,
      musicType,
    },
  })

  // Droppable for receiving panels
  const { setNodeRef: setDroppableNodeRef, isOver: isDroppableOver } = useDroppable({
    id: `node-droppable-${nodeIndex}`,
    data: {
      type: "node-droppable",
      nodeIndex,
    },
  })

  // Combine refs
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableNodeRef(node)
    setDroppableNodeRef(node)
  }

  const nodeStyle = {
    transform: CSS.Transform.toString(sortableTransform),
    transition: sortableTransition,
    opacity: isSortableDragging ? 0.7 : 1,
    zIndex: isSortableDragging ? 100 : 1,
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = panels.findIndex((panel) => panel.id === active.id)
      const newIndex = panels.findIndex((panel) => panel.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newPanels = arrayMove(panels, oldIndex, newIndex)
        onReorderPanels(nodeIndex, newPanels)
      }
    }
  }

  // Usar el ancho mínimo compacto del código que proporcionaste
  const minWidth = Math.max(120, 80 + panels.length * 30)

  return (
    <div className="flex flex-col space-y-0.5 flex-shrink-0 ml-1 mt-1" style={{ minWidth: `${minWidth}px` }}>
      <Card
        className={`text-white p-0.5 ${isSortableDragging ? "shadow-xl scale-105" : ""} ${
          isDroppableOver ? "ring-2 ring-blue-400 ring-opacity-50 bg-opacity-80" : ""
        } ${selected ? "ring-2 ring-blue-400" : ""} transition-all duration-200`}
        ref={setNodeRef}
        style={nodeStyle}
        onClick={onSelect}
      >
        <div className="p-1.5 pb-1">
          {/* Header compacto */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-0.5">
              <DragHandle listeners={sortableListeners} attributes={sortableAttributes} />
              <h3 className="text-xs font-medium">Nodo {nodeIndex + 1}</h3>
            </div>
          </div>

          {/* Paneles compactos */}
          <div className="flex items-center space-x-0.5 mb-1">
            <div className="flex-1 overflow-x-auto">
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={panels.map((p) => p.id)} 
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="flex items-center space-x-1 min-w-max pb-0.5">
                    {panels.map((panel, index) => (
                      <React.Fragment key={panel.id}>
                        <SortablePanel 
                          panel={panel} 
                          nodeIndex={nodeIndex} 
                          panelIndex={index} 
                        />
                        {index < panels.length - 1 && (
                          <div className="w-2 h-0.5 bg-white/30 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* Sección de música compacta */}
          <div className="flex items-center justify-center space-x-0.5 px-1.5 py-0.5 rounded bg-white">
            <Music className="w-2.5 h-2.5 text-black" />
            <select
              className="font-medium capitalize text-black bg-transparent outline-none text-xs"
              value={musicType}
              onChange={(e) => updateMusicType(nodeIndex, e.target.value)}
            >
              <option value="feliz">Feliz</option>
              <option value="triste">Triste</option>
              <option value="drama">Drama</option>
              <option value="acción">Acción</option>
              <option value="tensión">Tensión</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  )
}