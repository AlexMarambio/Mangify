import React from "react"
import NodeTrack from "./node-track"
import MusicTrack from "./music-track"

interface TimelineProps {
  activeMode: string
}

const mockNodes = [
  {
    id: "1",
    title: "Node 1",
    color: "bg-green-500",
    start: 0,
    end: 50,
    bulletPoints: [
      { id: "b1", text: "Bullet 1", position: 10, nodeId: "1" },
      { id: "b2", text: "Bullet 2", position: 30, nodeId: "1" }
    ]
  },
  {
    id: "2",
    title: "Node 2",
    color: "bg-blue-500",
    start: 60,
    end: 100,
    bulletPoints: [
      { id: "b3", text: "Bullet 3", position: 70, nodeId: "2" },
      { id: "b4", text: "Bullet 4", position: 90, nodeId: "2" }
    ]
  }
]

const mockMusic = [
  {
    id: "m1",
    title: "Music 1",
    color: "bg-green-700",
    start: 0,
    end: 50,
    nodeId: "1"
  },
  {
    id: "m2",
    title: "Music 2",
    color: "bg-blue-700",
    start: 60,
    end: 100,
    nodeId: "2"
  }
]

const Timeline: React.FC<TimelineProps> = ({ activeMode }) => {
  // Puedes ajustar el ancho y la conversión de tiempo a píxeles
  const width = 1000
  const timeToPixel = (time: number) => (time * width) / 100
  const pixelToTime = (pixel: number) => (pixel * 100) / width

  // Handlers vacíos para ejemplo
  const handleNodeResize = () => {}
  const handleBulletPointDrag = () => {}
  const handleMusicResize = () => {}

  //const { nodes, music } = useAppContext();

  return (
    <div className="w-full bg-gray-900 p-4">
      <NodeTrack
        nodes={mockNodes}
        width={width}
        timeToPixel={timeToPixel}
        pixelToTime={pixelToTime}
        onNodeResize={handleNodeResize}
        onBulletPointDrag={handleBulletPointDrag}
      />
      <MusicTrack
        music={mockMusic}
        nodes={mockNodes}
        width={width}
        timeToPixel={timeToPixel}
        pixelToTime={pixelToTime}
        onMusicResize={handleMusicResize}
      />
    </div>
  )
}

export default Timeline