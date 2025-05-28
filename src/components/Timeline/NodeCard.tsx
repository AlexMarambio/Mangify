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
import { Button, Card } from "flowbite-react"
import { Music, Plus } from "lucide-react"
import { SortablePanel } from "./SortablePanel"
import { DragHandle } from "./DragHandle"
import { type NodeCardProps } from "../../timeline"

export function NodeCard({ nodeIndex, panels, musicType, onAddPanel, onReorderPanels, onDeletePanel, isOver }: NodeCardProps) {
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
    zIndex: isSortableDragging ? 1000 : 1,
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

  const getNodeColor = () => {
    if (panels.length > 0) {
      return panels[0].fill === "bg-emerald-500" ? "bg-emerald-600" : "bg-violet-600"
    }
    return "bg-gray-600"
  }

  const getMusicColor = () => {
    return musicType === "feliz" ? "bg-emerald-500" : "bg-violet-500"
  }

  // Calculate minimum width based on panel count
  const minWidth = Math.max(320, 200 + panels.length * 60)

  return (
    <div className="flex flex-col space-y-2 flex-shrink-0" style={{ minWidth: `${minWidth}px` }}>
      <Card
        className={`${getNodeColor()} text-white border-0 ${isSortableDragging ? "shadow-2xl scale-105" : ""} ${
          isDroppableOver ? "ring-4 ring-blue-400 ring-opacity-50 bg-opacity-80" : ""
        } transition-all duration-200`}
        ref={setNodeRef}
        style={nodeStyle}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DragHandle listeners={sortableListeners} attributes={sortableAttributes} />
              <h3 className="text-lg font-semibold">Nodo {nodeIndex + 1}</h3>
            </div>
            <Button 
              onClick={() => onAddPanel(nodeIndex)} 
              size="sm" 
              color="gray" 
              outline 
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Viñeta
            </Button>
          </div>

          <div className="flex items-center space-x-2 mb-4">
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
                  <div className="flex items-center space-x-4 min-w-max pb-2">
                    {panels.map((panel, index) => (
                      <React.Fragment key={panel.id}>
                        <SortablePanel 
                          panel={panel} 
                          nodeIndex={nodeIndex} 
                          panelIndex={index} 
                        />
                        {index < panels.length - 1 && (
                          <div className="w-8 h-0.5 bg-white/50 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* Integrated Music Section */}
          <div className={`flex items-center justify-center space-x-2 p-2 rounded-lg ${getMusicColor()}`}>
            <Music className="w-4 h-4" />
            <span className="font-medium capitalize">{musicType}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}