import React, { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type Panel } from "../../timeline"

interface SortablePanelProps {
  panel: Panel
  nodeIndex: number
  panelIndex: number
}

export function SortablePanel({ panel, nodeIndex, panelIndex }: SortablePanelProps) {
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }

  const handleDelete = () => {
    // @ts-ignore - onDeletePanel is passed through props but not typed
    if (panel.onDeletePanel) {
      panel.onDeletePanel(nodeIndex, panel.id)
      // Disparar evento personalizado para sincronizar con la vista
      window.dispatchEvent(new CustomEvent('delete-panel', { 
        detail: { panelId: panel.id }
      }));
    }
    setShowContextMenu(false)
  }

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onContextMenu={handleContextMenu}
        className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-center ${panel.fill} border-2 border-white/20 shadow-lg`}
        >
          {panelIndex + 1}
        </div>
      </div>

      {showContextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-lg py-1 z-50"
          style={{
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
          }}
        >
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            Eliminar
          </button>
        </div>
      )}
    </>
  )
}