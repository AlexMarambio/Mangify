import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type Panel } from "../../timeline"

interface SortablePanelProps {
  panel: Panel
  nodeIndex: number
  panelIndex: number
}

export function SortablePanel({ panel, nodeIndex, panelIndex }: SortablePanelProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: panel.id,
    data: {
      type: "panel",
      nodeIndex,
      panelIndex,
      panel,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
    >
      <div
        className={`w-full h-full rounded-full flex items-center justify-center ${panel.fill} border-2 border-white/20 shadow-lg`}
      >
        {panelIndex + 1}
      </div>
    </div>
  )
}