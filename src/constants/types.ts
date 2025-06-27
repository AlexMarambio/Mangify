// types.ts
export interface ShapeMetadata {
  order: number;
  chapter: number;
  page: number;
  panel: number;
  createdAt: string;
  musicType?: string;
  nodeId?: string;
}

export interface ComicShape {
  id: string;
  points: number[];
  fill: string;
  closed: boolean;
  metadata: ShapeMetadata;
  text?: string;
}

export interface Node {
  id: string;
  name: string;
  mood: string;
  color: string;
  start: number;
  end: number;
}

export interface ComicData {
  metadata: {
    title: string;
    chapter: string;
    author: string;
    created: string;
  };
  nodes: Node[];
  pages: {
    [page: string]: ComicShape[];
  };
}

export interface Panel extends ComicShape {
  // Puedes mantener esta interfaz si es necesaria para compatibilidad
}