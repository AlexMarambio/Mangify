// Node types
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

// Bullet point types
export interface TimelineBulletPoint {
  id: string
  text: string
  position: number
  nodeId: string
}

// Music track types
export interface TimelineMusic {
  id: string
  musicType: string
  start: number
  end: number
  nodeId: string
}

// Timeline state
export interface TimelineState {
  nodes: TimelineNode[]
  music: TimelineMusic[]
  duration: number
  scale: number
}
