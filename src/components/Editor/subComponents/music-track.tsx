import type React from "react"

import { useState } from "react"
import type { TimelineMusic, TimelineNode} from "../../../timeline"

interface MusicTrackProps {
  music: TimelineMusic[]
  nodes: TimelineNode[]
  width: number
  timeToPixel: (time: number) => number
  pixelToTime: (pixel: number) => number
  onMusicResize: (musicId: string, start: number, end: number) => void
}

const MusicTrack: React.FC<MusicTrackProps> = ({ music, nodes, //width, 
  timeToPixel, pixelToTime, onMusicResize }) => {
  const [dragging, setDragging] = useState<{
    type: "music-start" | "music-end"
    id: string
    initialPosition: number
    initialValue: number
  } | null>(null)

  // Handle mouse down on music edge
  const handleMouseDown = (
    e: React.MouseEvent,
    type: "music-start" | "music-end",
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

    if (dragging.type === "music-start") {
      const musicTrack = music.find((m) => m.id === dragging.id)
      if (musicTrack) {
        const newStart = dragging.initialValue + deltaTime
        if (newStart < musicTrack.end) {
          onMusicResize(dragging.id, newStart, musicTrack.end)
        }
      }
    } else if (dragging.type === "music-end") {
      const musicTrack = music.find((m) => m.id === dragging.id)
      if (musicTrack) {
        const newEnd = Math.max(musicTrack.start, dragging.initialValue + deltaTime)
        onMusicResize(dragging.id, musicTrack.start, newEnd)
      }
    }
  }

  // Handle mouse up to end drag
  const handleMouseUp = () => {
    setDragging(null)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  // Render node boundaries as background guides
  const renderNodeBoundaries = () => {
    return nodes.map((node) => {
      const startPx = timeToPixel(node.start)
      const endPx = timeToPixel(node.end)
      const widthPx = endPx - startPx

      return (
        <div
          key={`boundary-${node.id}`}
          className="absolute h-full border-l border-r border-gray-600 border-dashed bg-gray-700 bg-opacity-20"
          style={{
            left: `${startPx}px`,
            width: `${widthPx}px`,
          }}
        />
      )
    })
  }

  return (
    <div className="relative h-16 w-full bg-gray-800 rounded">
      {/* Render node boundaries */}
      {renderNodeBoundaries()}

      {/* Render music tracks */}
      {music.map((musicTrack) => {
        const startPx = timeToPixel(musicTrack.start)
        const endPx = timeToPixel(musicTrack.end)
        const widthPx = endPx - startPx

        // Find the associated node to get its color
        const node = nodes.find((n) => n.id === musicTrack.nodeId)
        const colorClass = node ? node.color.replace("bg-", "bg-") : "bg-green-500"

        return (
          <div
            key={musicTrack.id}
            className={`absolute h-8 top-4 ${colorClass} rounded flex items-center`}
            style={{
              left: `${startPx}px`,
              width: `${widthPx}px`,
            }}
          >
            {/* Music title */}
            <div className="px-2 text-xs font-semibold text-white truncate w-full text-center">{musicTrack.musicType}</div>

            {/* Left resize handle */}
            <div
              className="absolute left-0 h-full w-2 cursor-ew-resize group"
              onMouseDown={(e) => handleMouseDown(e, "music-start", musicTrack.id, musicTrack.start)}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white opacity-0 group-hover:opacity-50"></div>
            </div>

            {/* Right resize handle */}
            <div
              className="absolute right-0 h-full w-2 cursor-ew-resize group"
              onMouseDown={(e) => handleMouseDown(e, "music-end", musicTrack.id, musicTrack.end)}
            >
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-0 group-hover:opacity-50"></div>
            </div>

            {/* Triangle marker */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-green-400"></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MusicTrack