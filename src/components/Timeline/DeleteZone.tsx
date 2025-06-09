import { useDroppable } from "@dnd-kit/core"
import { Trash2 } from "lucide-react"
import { type DeleteZoneProps } from "../../timeline"

export function DeleteZone({ isActive, dragType }: DeleteZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "delete-zone",
  })

  const getDeleteMessage = () => {
    if (dragType === "node") return "Arrastra aquí para eliminar nodo"
    if (dragType === "panel") return "Arrastra aquí para eliminar viñeta"
    return "Arrastra aquí para eliminar"
  }

  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
        isActive ? "scale-100 opacity-100" : "scale-75 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`flex items-center space-x-2 px-6 py-4 rounded-lg border-2 border-dashed transition-colors ${
          isOver
            ? "bg-red-700 border-red-300 text-white scale-110"
            : isActive
              ? "bg-red-600 border-red-400 text-white"
              : "bg-red-600/20 border-red-400/50 text-red-400"
        }`}
      >
        <Trash2 className="w-5 h-5" />
        <span className="font-medium">{getDeleteMessage()}</span>
      </div>
    </div>
  )
}