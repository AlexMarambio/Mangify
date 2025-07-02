import type React from "react"
import { useState } from "react"
import { GripHorizontal } from "lucide-react"

interface TimelineNode {
  id: string
  title: string
  color: string
  start: number
  end: number
  bulletPoints: TimelineBulletPoint[]
}

interface TimelineBulletPoint {
  id: string
  text: string
  position: number
  nodeId: string
}

interface NodeTrackProps {
  nodes: TimelineNode[]
  width: number
  timeToPixel: (time: number) => number
  pixelToTime: (pixel: number) => number
  onNodeResize: (nodeId: string, start: number, end: number) => void
  onBulletPointDrag: (bulletPointId: string, position: number) => void
}

const NodeTrack: React.FC<NodeTrackProps> = ({
  nodes,
  width,
  timeToPixel,
  pixelToTime,
  onNodeResize,
  onBulletPointDrag,
}) => {
  const [dragging, setDragging] = useState<{
    type: "node-start" | "node-end" | "bullet-point"
    id: string
    initialPosition: number
    initialValue: number
  } | null>(null)

  // Handle mouse down on node edge or bullet point
  const handleMouseDown = (
    e: React.MouseEvent,
    type: "node-start" | "node-end" | "bullet-point",
    id: string,
    initialValue: number,
  ) => {
    e.preventDefault()
    setDragging({
      type,
      id,
      initialPosition: e.clientX,
      initialValue,
    })

    // Add document-level event listeners
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Handle mouse move during drag
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return

    const deltaPixels = e.clientX - dragging.initialPosition
    const deltaTime = pixelToTime(deltaPixels)

    if (dragging.type === "node-start") {
      const node = nodes.find((n) => n.id === dragging.id)
      if (node) {
        const newStart = Math.max(0, dragging.initialValue + deltaTime)
        if (newStart < node.end) {
          onNodeResize(dragging.id, newStart, node.end)
        }
      }
    } else if (dragging.type === "node-end") {
      const node = nodes.find((n) => n.id === dragging.id)
      if (node) {
        const newEnd = Math.max(node.start, dragging.initialValue + deltaTime)
        onNodeResize(dragging.id, node.start, newEnd)
      }
    } else if (dragging.type === "bullet-point") {
      const newPosition = dragging.initialValue + deltaTime
      onBulletPointDrag(dragging.id, newPosition)
    }
  }

  // Handle mouse up to end drag
  const handleMouseUp = () => {
    setDragging(null)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="relative h-16 w-full bg-gray-800 rounded">
      {/* Render nodes */}
      {nodes.map((node) => {
        const startPx = timeToPixel(node.start)
        const endPx = timeToPixel(node.end)
        const widthPx = endPx - startPx

        return (
          <div
            key={node.id}
            className={`absolute h-full ${node.color} bg-opacity-30 rounded flex items-center`}
            style={{
              left: `${startPx}px`,
              width: `${widthPx}px`,
            }}
          >
            {/* Node title */}
            <div className="absolute top-0 left-2 text-xs font-semibold text-white">{node.title}</div>

            {/* Left resize handle */}
            <div
              className="absolute left-0 h-full w-2 cursor-ew-resize group"
              onMouseDown={(e) => handleMouseDown(e, "node-start", node.id, node.start)}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white opacity-0 group-hover:opacity-50"></div>
            </div>

            {/* Right resize handle */}
            <div
              className="absolute right-0 h-full w-2 cursor-ew-resize group"
              onMouseDown={(e) => handleMouseDown(e, "node-end", node.id, node.end)}
            >
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-0 group-hover:opacity-50"></div>
            </div>

            {/* Render bullet points */}
            {node.bulletPoints.map((bulletPoint) => {
              const bulletPx = timeToPixel(bulletPoint.position) - startPx

              return (
                <div
                  key={bulletPoint.id}
                  className="absolute bottom-2 cursor-move"
                  style={{ left: `${bulletPx}px` }}
                  onMouseDown={(e) => handleMouseDown(e, "bullet-point", bulletPoint.id, bulletPoint.position)}
                >
                  <div className="w-4 h-4 rounded-full bg-pink-400 flex items-center justify-center">
                    <GripHorizontal size={10} className="text-pink-900" />
                  </div>
                  <div className="absolute bottom-full mb-1 text-xs whitespace-nowrap transform -translate-x-1/2">
                    {bulletPoint.text}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default NodeTrack