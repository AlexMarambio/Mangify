import React, { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type Panel } from "../../timeline"
import { useComic } from "./ComicContext"

interface SortablePanelProps {
  panel: Panel
  nodeIndex: number
  panelIndex: number
}

export function SortablePanel({ panel, nodeIndex, panelIndex }: SortablePanelProps) {
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const { deletePanel } = useComic()

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
    // Usar la función deletePanel del contexto
    deletePanel(nodeIndex, panel.id)
    
    // Disparar evento personalizado para sincronizar con la vista del editor
    window.dispatchEvent(new CustomEvent('delete-panel', { 
      detail: { panelId: panel.id }
    }));
    
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
        className="flex m-2 items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-center ${panel.fill} border border-white/20 shadow-md`}
        >
          {panelIndex + 1}
        </div>
      </div>

      {showContextMenu && (
        <div
          className="fixed bg-card border border-border rounded-lg shadow-lg py-1 z-50 min-w-[100px]"
          style={{
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
          }}
        >
          <button
            onClick={handleDelete}
            className="w-full px-3 py-1.5 text-left text-xs text-destructive hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </>
  )
}