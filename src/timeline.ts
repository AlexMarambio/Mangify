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


/* Timeline 2.0 */

export interface Panel {
  id: string
  points: any[]
  fill: string
  closed: boolean
  metadata: {
    order: number
    chapter: number
    page: number
    panel: number
    createdAt: string
    musicType: string
  }
  onDeletePanel?: (nodeIndex: number, panelId: string) => void
}

export interface ComicData {
  metadata: {
    title: string
    author: string
    created: string
  }
  chapters: {
    [key: string]: {
      [key: string]: Panel[]
    }
  }
}

export interface SortablePanelProps {
  panel: Panel
  nodeIndex: number
  panelIndex: number
}

export interface DragHandleProps {
  listeners: any
  attributes: any
}

export interface NodeCardProps {
  nodeIndex: number
  panels: Panel[]
  musicType: string
  onAddPanel: (nodeIndex: number) => void
  onReorderPanels: (nodeIndex: number, newPanels: Panel[]) => void
  onDeletePanel: (nodeIndex: number, panelId: string) => void
  isOver: boolean
}

export interface DeleteZoneProps {
  isActive: boolean
  dragType: string | null
}

export interface Node {
  nodeIndex: number;
  nodeKey: string;
  panels: Panel[];
  musicType: string;
} 