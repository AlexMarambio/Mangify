import { GripVertical } from "lucide-react"

interface DragHandleProps {
  listeners: any
  attributes: any
}

export function DragHandle({ listeners, attributes }: DragHandleProps) {
  return (
    <div
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded transition-colors"
    >
      <GripVertical className="w-4 h-4 text-white/60" />
    </div>
  )
}