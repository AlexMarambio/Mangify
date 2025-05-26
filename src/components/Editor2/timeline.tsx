import { useState, useEffect, useRef } from "react"
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
  pageNumber: number
  panelNumber: number
}

export interface TimelineBulletPoint {
  id: string
  text: string
  position: number
  nodeId: string
  metadata?: {
    musicType?: string
    order?: number
    chapter?: number
    page?: number
    panel?: number
    createdAt?: string
    // otros campos opcionales
  }
}

export interface TimelineMusic {
  id: string
  musicType: string
  start: number
  end: number
  nodeId: string
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
            title: "Panel 1",
            color: "bg-emerald-500",
            start: 0,
            end: 50,
            pageNumber: 1,
            panelNumber: 1,
            bulletPoints: [
              { id: "bullet-1", text: "Panel 1", position: 10, nodeId: "node-1" },
            ],
          },
          {
            id: "node-2",
            title: "Panel 2",
            color: "bg-violet-500",
            start: 60,
            end: 110,
            pageNumber: 1,
            panelNumber: 2,
            bulletPoints: [
              { id: "bullet-2", text: "Panel 2", position: 70, nodeId: "node-2" },
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
            musicType: "triste",
            start: 0,
            end: 50,
            nodeId: "node-1",
          },
          {
            id: "music-2",
            musicType: "feliz",
            start: 60,
            end: 110,
            nodeId: "node-2",
          },
        ],
  )

  const [activeMode, setActiveMode] = useState<"node" | "bullet" | "music">("node")
  const [timelineWidth, setTimelineWidth] = useState(1000)
  const timelineContainerRef = useRef<HTMLDivElement>(null)

  // Update timeline width based on container size
  useEffect(() => {
    if (!timelineContainerRef.current) return

    const updateWidth = () => {
      if (timelineContainerRef.current) {
        setTimelineWidth(timelineContainerRef.current.clientWidth)
      }
    }

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(timelineContainerRef.current);

    //updateWidth()
    //window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [timelineContainerRef.current])

  // Notify parent component of changes
  useEffect(() => {
    onChange?.(nodes, music)
  }, [nodes, music])

  // Scroll automático al agregar un nodo nuevo (hasta el end del último nodo)
  useEffect(() => {
    if (timelineContainerRef.current && nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      const scrollTo = timeToPixel(lastNode.end);
      setTimeout(() => {
        timelineContainerRef.current!.scrollTo({
          left: scrollTo,
          behavior: "smooth",
        });
      }, 0);
    }
  }, [nodes.length, timelineContainerRef.current]);

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
  const handleBulletPointDrag = (bulletPointId: string, newPosition: number, newNodeId: string) => {
    setNodes(prevNodes => {
      let movedBullet: TimelineBulletPoint | undefined;
      // Quitar la viñeta del nodo original
      const nodesWithoutBullet = prevNodes.map(node => {
        const filtered = node.bulletPoints.filter(bp => {
          if (bp.id === bulletPointId) {
            movedBullet = bp;
            return false;
          }
          return true;
        });
        return { ...node, bulletPoints: filtered };
      });

      if (!movedBullet) return prevNodes;

      // Actualizar la viñeta con la nueva posición y nodeId
      const updatedBullet = {
        ...movedBullet,
        position: newPosition,
        nodeId: newNodeId,
      };

      // Agregar la viñeta al nuevo nodo
      const nodesWithBullet = nodesWithoutBullet.map(node =>
        node.id === newNodeId
          ? { ...node, bulletPoints: [...node.bulletPoints, updatedBullet] }
          : node
      );

      // Recalcular los textos correlativos de las viñetas del nodo destino
      return nodesWithBullet.map(node => {
        if (node.id !== newNodeId) return node;
        return {
          ...node,
          bulletPoints: node.bulletPoints
            .sort((a, b) => a.position - b.position)
            .map((bp, idx) => ({
              ...bp,
              text: `Bullet ${idx + 1}`,
            })),
        };
      });
    });
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

  const nodeColors = ["red", "blue", "green", "violet"];
  const [colorIndex, setColorIndex] = useState(0);

  const getNextColor = () => {
    const color = nodeColors[colorIndex % nodeColors.length];
    setColorIndex(colorIndex + 1);
    return color;
  };

  // Add a new node
  const handleAddNode = () => {
    if (readOnly) return

    const nodeSize = 50 // Tamaño de cada nodo
    const nodeGap = 10  // Espacio entre nodos

    const maxEnd = nodes.length > 0 ? Math.max(...nodes.map(n => n.end)) : 0
    const start = nodes.length > 0 ? maxEnd + nodeGap : 0
    const end = start + nodeSize
    const newNodeId = `node-${Date.now()}`

    const newNode: TimelineNode = {
      id: newNodeId,
      title: `Node ${nodes.length + 1}`,
      color: `bg-${getNextColor()}-500`,
      start,
      end,
      pageNumber: 1,
      panelNumber: 1,
      bulletPoints: [],
    }

    setNodes([...nodes, newNode])

    // Agrega una pista de música para el nuevo nodo
    const newMusic: TimelineMusic = {
      id: `music-${Date.now()}`,
      musicType: "triste",
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
    const colors = ["red", "blue", "green",  "violet"]
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

      <div className="p-4 overflow-x-auto" ref={timelineContainerRef}>
        {/* ${isMobile ? "space-y-2" : */}
        <div
          className="space-y-4"
          style={{
            minWidth: nodes.length > 0
              ? `${timeToPixel(nodes[nodes.length - 1].end) + 40}px`
              : "100%",
          }}
        >
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
