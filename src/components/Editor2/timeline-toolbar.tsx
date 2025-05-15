"use client"
import { Button } from "flowbite-react"
//import { Button } from "@/components/ui/button"
import { LayoutGrid, ListIcon as ListBullets, Music, Plus, PlusCircle } from "lucide-react"

interface TimelineToolbarProps {
  activeMode: "node" | "bullet" | "music"
  onModeChange: (mode: "node" | "bullet" | "music") => void
  onAddNode: () => void
  onAddBulletPoint: () => void
}

export function TimelineToolbar({ activeMode, onModeChange, onAddNode, onAddBulletPoint }: TimelineToolbarProps) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between">
      <div className="flex space-x-1">
        <Button
          //variant={activeMode === "node" ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange("node")}
          className="h-8"
        >
          <LayoutGrid size={16} className="mr-1" />
          <span className="hidden sm:inline">Nodos</span>
        </Button>

        <Button
          //variant={activeMode === "bullet" ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange("bullet")}
          className="h-8"
        >
          <ListBullets size={16} className="mr-1" />
          <span className="hidden sm:inline">Viñetas</span>
        </Button>

        <Button
          //variant={activeMode === "music" ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange("music")}
          className="h-8"
        >
          <Music size={16} className="mr-1" />
          <span className="hidden sm:inline">Música</span>
        </Button>
      </div>

      <div className="flex space-x-1">
        <Button //variant="outline" 
        size="sm" onClick={onAddBulletPoint} className="h-8">
          <PlusCircle size={16} className="mr-1" />
          <span className="hidden sm:inline">Añadir Viñeta</span>
        </Button>

        <Button //variant="outline" 
        size="sm" onClick={onAddNode} className="h-8">
          <Plus size={16} className="mr-1" />
          <span className="hidden sm:inline">Añadir Nodo</span>
        </Button>
      </div>
    </div>
  )
}
