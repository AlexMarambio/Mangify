import { useState, useEffect } from "react"
import { NodeTrack } from "./node-track"
import { MusicTrack } from "./music-track"
import { TimelineToolbar } from "./timeline-toolbar"
//import { useMediaQuery } from "@/hooks/use-mobile"

export interface TimelineNode {
  id: string
  title: string
  color: string
  start: number
  end: number
  bulletPoints: TimelineBulletPoint[]
}

export interface TimelineBulletPoint {
  id: string
  text: string
  position: number
  nodeId: string
}

export interface TimelineMusic {
  id: string
  title: string
  start: number
  end: number
  nodeId: string
  file?: string
}

interface TimelineProps {
  initialNodes?: TimelineNode[]
  initialMusic?: TimelineMusic[]
  onChange?: (nodes: TimelineNode[], music: TimelineMusic[]) => void
  readOnly?: boolean
}

export function Timeline({ initialNodes = [], initialMusic = [], onChange, readOnly = false }: TimelineProps) {
  const [nodes, setNodes] = useState<TimelineNode[]>(
    initialNodes.length
      ? initialNodes
      : [
          {
            id: "node-1",
            title: "Node 1",
            color: "bg-emerald-500",
            start: 0,
            end: 50,
            bulletPoints: [
              { id: "bullet-1", text: "Bullet 1", position: 10, nodeId: "node-1" },
              { id: "bullet-2", text: "Bullet 2", position: 30, nodeId: "node-1" },
            ],
          },
          {
            id: "node-2",
            title: "Node 2",
            color: "bg-violet-500",
            start: 60,
            end: 120,
            bulletPoints: [
              { id: "bullet-3", text: "Bullet 3", position: 70, nodeId: "node-2" },
              { id: "bullet-4", text: "Bullet 4", position: 90, nodeId: "node-2" },
            ],
          },
        ],
  )

  const [music, setMusic] = useState<TimelineMusic[]>(
    initialMusic.length
      ? initialMusic
      : [
          {
            id: "music-1",
            title: "We Are the Champions.mp3",
            start: 0,
            end: 50,
            nodeId: "node-1",
            file: "/we-are-the-champions.mp3",
          },
          {
            id: "music-2",
            title: "Another One Bites the Dust.mp3",
            start: 60,
            end: 120,
            nodeId: "node-2",
            file: "/another-one-bites-the-dust.mp3",
          },
        ],
  )

  const [activeMode, setActiveMode] = useState<"node" | "bullet" | "music">("node")
  const [timelineWidth, setTimelineWidth] = useState(1000)
  const [timelineContainerRef, setTimelineContainerRef] = useState<HTMLDivElement | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Update timeline width based on container size
  useEffect(() => {
    if (!timelineContainerRef) return

    const updateWidth = () => {
      setTimelineWidth(timelineContainerRef.clientWidth)
    }

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(timelineContainerRef);

    //updateWidth()
    //window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [timelineContainerRef])

  // Notify parent component of changes
  useEffect(() => {
    onChange?.(nodes, music)
  }, [nodes, music, onChange])

  // Time to pixel conversion functions
  const timeToPixel = (time: number) => (time * timelineWidth) / 150
  const pixelToTime = (pixel: number) => (pixel * 150) / timelineWidth

  // Handle node resizing
  const handleNodeResize = (nodeId: string, start: number, end: number) => {
    if (readOnly) return

    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, start, end }
        }
        return node
      })
      return updatedNodes
    })

    // Update associated music to match node boundaries
    setMusic((prevMusic) => {
      return prevMusic.map((track) => {
        if (track.nodeId === nodeId) {
          return { ...track, start, end }
        }
        return track
      })
    })
  }

  // Handle bullet point dragging
  const handleBulletPointDrag = (bulletPointId: string, position: number) => {
    if (readOnly) return

    // Find which node contains this position
    const containingNode = nodes.find((node) => position >= node.start && position <= node.end)

    if (!containingNode) return

    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        // Find the bullet point in the current node
        const bulletIndex = node.bulletPoints.findIndex((bp) => bp.id === bulletPointId)

        if (bulletIndex >= 0) {
          // Remove the bullet point from its current node
          const updatedBulletPoints = [...node.bulletPoints]
          const [bulletPoint] = updatedBulletPoints.splice(bulletIndex, 1)

          // If this is the containing node, add it back with updated position
          if (node.id === containingNode.id) {
            updatedBulletPoints.push({
              ...bulletPoint,
              position,
              nodeId: containingNode.id,
            })
          }

          return {
            ...node,
            bulletPoints: updatedBulletPoints,
          }
        }
        // If this is the containing node and the bullet wasn't in this node before
        else if (node.id === containingNode.id) {
          // Find the bullet point in all nodes
          const bulletPoint = prevNodes.flatMap((n) => n.bulletPoints).find((bp) => bp.id === bulletPointId)

          if (bulletPoint) {
            return {
              ...node,
              bulletPoints: [
                ...node.bulletPoints,
                {
                  ...bulletPoint,
                  position,
                  nodeId: containingNode.id,
                },
              ],
            }
          }
        }

        return node
      })
    })
  }

  // Handle music track resizing
  const handleMusicResize = (musicId: string, start: number, end: number) => {
    if (readOnly) return

    setMusic((prevMusic) => {
      return prevMusic.map((track) => {
        if (track.id === musicId) {
          return { ...track, start, end }
        }
        return track
      })
    })
  }

  // Add a new node
  const handleAddNode = () => {
    if (readOnly) return

    // Find the highest end time to place the new node after
    const maxEnd = Math.max(...nodes.map((node) => node.end), 0)
    const newNodeId = `node-${Date.now()}`

    const newNode: TimelineNode = {
      id: newNodeId,
      title: `Node ${nodes.length + 1}`,
      color: `bg-${getRandomColor()}-500`,
      start: maxEnd + 10,
      end: maxEnd + 60,
      bulletPoints: [],
    }

    setNodes([...nodes, newNode])

    // Add a music track for the new node
    const newMusic: TimelineMusic = {
      id: `music-${Date.now()}`,
      title: "New Music Track.mp3",
      start: newNode.start,
      end: newNode.end,
      nodeId: newNodeId,
    }

    setMusic([...music, newMusic])
  }

  // Add a new bullet point
  const handleAddBulletPoint = () => {
    if (readOnly || nodes.length === 0) return

    // Add to the first node by default
    const targetNode = nodes[0]
    const midPoint = (targetNode.start + targetNode.end) / 2

    const newBulletPoint: TimelineBulletPoint = {
      id: `bullet-${Date.now()}`,
      text: `Bullet ${targetNode.bulletPoints.length + 1}`,
      position: midPoint,
      nodeId: targetNode.id,
    }

    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (node.id === targetNode.id) {
          return {
            ...node,
            bulletPoints: [...node.bulletPoints, newBulletPoint],
          }
        }
        return node
      })
    })
  }

  // Helper function to get a random color
  const getRandomColor = () => {
    const colors = ["red", "blue", "green", "yellow", "purple", "pink", "indigo", "emerald", "amber", "violet"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden">
      {!readOnly && (
        <TimelineToolbar
          activeMode={activeMode}
          onModeChange={setActiveMode}
          onAddNode={handleAddNode}
          onAddBulletPoint={handleAddBulletPoint}
        />
      )}

      <div className="p-4 overflow-x-auto" ref={setTimelineContainerRef}>
        {/* ${isMobile ? "space-y-2" : */}
        <div className={`min-w-full  "space-y-4"}`}>
          <NodeTrack
            nodes={nodes}
            timeToPixel={timeToPixel}
            pixelToTime={pixelToTime}
            onNodeResize={handleNodeResize}
            onBulletPointDrag={handleBulletPointDrag}
            readOnly={readOnly}
          />

          <MusicTrack
            music={music}
            nodes={nodes}
            timeToPixel={timeToPixel}
            pixelToTime={pixelToTime}
            onMusicResize={handleMusicResize}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  )
}
// function useMediaQuery(arg0: string) {
//   throw new Error("Function not implemented.")
// }

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    listener();
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};
