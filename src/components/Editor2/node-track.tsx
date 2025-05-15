import type React from "react"
import { useState } from "react"
import { GripHorizontal } from "lucide-react"
import type { TimelineNode } from "./timeline"

interface NodeTrackProps {
  nodes: TimelineNode[]
  timeToPixel: (time: number) => number
  pixelToTime: (pixel: number) => number
  onNodeResize: (nodeId: string, start: number, end: number) => void
  onBulletPointDrag: (bulletPointId: string, position: number) => void
  readOnly?: boolean
}

export function NodeTrack({
  nodes,
  timeToPixel,
  pixelToTime,
  onNodeResize,
  onBulletPointDrag,
  readOnly = false,
}: NodeTrackProps) {
  const [dragging, setDragging] = useState<{
    type: "node-start" | "node-end" | "bullet-point"
    id: string
    initialPosition: number
    initialValue: number
  } | null>(null)

  // Handle mouse/touch down on node edge or bullet point
  const handleDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    type: "node-start" | "node-end" | "bullet-point",
    id: string,
    initialValue: number,
  ) => {
    if (readOnly) return

    e.preventDefault()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX

    setDragging({
      type,
      id,
      initialPosition: clientX,
      initialValue,
    })

    // Add document-level event listeners
    if ("touches" in e) {
      document.addEventListener("touchmove", handleDragMove)
      document.addEventListener("touchend", handleDragEnd)
    } else {
      document.addEventListener("mousemove", handleDragMove)
      document.addEventListener("mouseup", handleDragEnd)
    }
  }

  // Handle mouse/touch move during drag
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const deltaPixels = clientX - dragging.initialPosition
    const deltaTime = pixelToTime(deltaPixels)

    if (dragging.type === "node-start") {
      const node = nodes.find((n) => n.id === dragging.id)
      if (node) {
        const newStart = Math.max(0, dragging.initialValue + deltaTime)
        if (newStart < node.end - 10) {
          // Minimum node width
          onNodeResize(dragging.id, newStart, node.end)
        }
      }
    } else if (dragging.type === "node-end") {
      const node = nodes.find((n) => n.id === dragging.id)
      if (node) {
        const newEnd = Math.max(node.start + 10, dragging.initialValue + deltaTime)
        onNodeResize(dragging.id, node.start, newEnd)
      }
    } else if (dragging.type === "bullet-point") {
      const newPosition = Math.max(0, dragging.initialValue + deltaTime)
      onBulletPointDrag(dragging.id, newPosition)
    }
  }

  // Handle mouse/touch up to end drag
  const handleDragEnd = () => {
    setDragging(null)
    document.removeEventListener("mousemove", handleDragMove)
    document.removeEventListener("mouseup", handleDragEnd)
    document.removeEventListener("touchmove", handleDragMove)
    document.removeEventListener("touchend", handleDragEnd)
  }

  return (
    <div className="relative h-24 md:h-32 w-full bg-gray-800 rounded-lg overflow-hidden">
      {/* Render nodes */}
      {nodes.map((node) => {
        const startPx = timeToPixel(node.start)
        const endPx = timeToPixel(node.end)
        const widthPx = endPx - startPx

        return (
          <div
            key={node.id}
            className={`absolute h-full ${node.color} bg-opacity-30 rounded-md flex flex-col`}
            style={{
              left: `${startPx}px`,
              width: `${widthPx}px`,
            }}
          >
            {/* Node title */}
            <div className="px-2 py-1 text-xs md:text-sm font-semibold text-white truncate">{node.title}</div>

            {/* Bullet point container - takes remaining height */}
            <div className="flex-1 relative">
              {/* Grid lines for bullet point placement */}
              <div className="absolute inset-0 grid grid-cols-4 gap-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border-r border-white/10 h-full" />
                ))}
              </div>
            </div>

            {!readOnly && (
              <>
                {/* Left resize handle */}
                <div
                  className="absolute left-0 h-full w-2 cursor-ew-resize group"
                  onMouseDown={(e) => handleDragStart(e, "node-start", node.id, node.start)}
                  onTouchStart={(e) => handleDragStart(e, "node-start", node.id, node.start)}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white opacity-0 group-hover:opacity-50"></div>
                </div>

                {/* Right resize handle */}
                <div
                  className="absolute right-0 h-full w-2 cursor-ew-resize group"
                  onMouseDown={(e) => handleDragStart(e, "node-end", node.id, node.end)}
                  onTouchStart={(e) => handleDragStart(e, "node-end", node.id, node.end)}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-0 group-hover:opacity-50"></div>
                </div>
              </>
            )}

            {/* Render bullet points */}
            {node.bulletPoints.map((bulletPoint) => {
              const bulletPx = timeToPixel(bulletPoint.position) - startPx
              const isOutOfBounds = bulletPx < 0 || bulletPx > widthPx

              if (isOutOfBounds) return null

              return (
                <div
                  key={bulletPoint.id}
                  className={`absolute bottom-3 md:bottom-4 ${readOnly ? "" : "cursor-move"}`}
                  style={{ left: `${bulletPx}px` }}
                  onMouseDown={
                    readOnly
                      ? undefined
                      : (e) => handleDragStart(e, "bullet-point", bulletPoint.id, bulletPoint.position)
                  }
                  onTouchStart={
                    readOnly
                      ? undefined
                      : (e) => handleDragStart(e, "bullet-point", bulletPoint.id, bulletPoint.position)
                  }
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-pink-400 flex items-center justify-center shadow-md">
                    {!readOnly && <GripHorizontal size={12} className="text-pink-900" />}
                  </div>
                  <div className="absolute bottom-full mb-1 text-xs md:text-sm whitespace-nowrap transform -translate-x-1/2 bg-gray-800/80 px-2 py-0.5 rounded">
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
