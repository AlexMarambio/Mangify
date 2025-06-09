import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ComicData, Panel, Node } from '../../timeline';

// Todas las funciones disponibles
interface ComicContextType {
  comicData: ComicData;
  addNewNode: () => void;
  addPanelToNode: (nodeIndex: number) => void;
  reorderPanels: (nodeIndex: number, newPanels: Panel[]) => void;
  deletePanel: (nodeIndex: number, panelId: string) => void;
  deleteNode: (nodeIndex: number) => void;
  movePanelToNode: (panelId: string, fromNodeIndex: number, toNodeIndex: number) => void;
  reorderNodes: (activeIndex: number, overIndex: number) => void;
  getNodesFromData: () => Node[];
}

const ComicContext = createContext<ComicContextType | undefined>(undefined);

// Hook personalizado para acceder al contexto
export const useComic = () => {
  const context = useContext(ComicContext);
  if (!context) {
    throw new Error('useComic debe ser usado dentro de un ComicProvider');
  }
  return context;
};

interface ComicProviderProps {
  children: ReactNode;
}

export const ComicProvider: React.FC<ComicProviderProps> = ({ children }) => {
  // Estado inicial del cómic con datos de ejemplo
  const [comicData, setComicData] = useState<ComicData>({
    metadata: {
      title: "Mi Cómic",
      author: "Tu Nombre",
      created: new Date().toISOString(),
    },
    chapters: {
      "1": {}
    },
  });

  // GET lista de nodos ordenados del capítulo actual
  const getNodesFromData = () => {
    const chapter = comicData.chapters["1"];
    return Object.keys(chapter)
      .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
      .map((nodeKey) => ({
        nodeIndex: Number.parseInt(nodeKey) - 1,
        nodeKey,
        panels: chapter[nodeKey],
        musicType: chapter[nodeKey][0]?.metadata.musicType || "feliz",
      }));
  };

  // Añade un nuevo nodo al final de la lista con una viñeta inicial
  const addNewNode = () => {
    const chapter = comicData.chapters["1"];
    const nodeKeys = Object.keys(chapter);
    const nextNodeKey = (nodeKeys.length + 1).toString();

    const newPanel: Panel = {
      id: `viñeta-${Date.now()}`,
      points: [],
      fill: "bg-blue-500",
      closed: true,
      metadata: {
        order: 10,
        chapter: 1,
        page: 1,
        panel: 1,
        createdAt: new Date().toISOString(),
        musicType: "feliz",
      },
    };

    setComicData((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        "1": {
          ...prev.chapters["1"],
          [nextNodeKey]: [newPanel],
        },
      },
    }));
  };

  // Añade una nueva viñeta a un nodo específico con un color aleatorio (o intento de)
  const addPanelToNode = (nodeIndex: number) => {
    const nodeKey = (nodeIndex + 1).toString();
    const chapter = comicData.chapters["1"];
    const currentPanels = chapter[nodeKey] || [];

    const colors = ["bg-emerald-500", "bg-violet-500", "bg-blue-500", "bg-red-500", "bg-yellow-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newPanel: Panel = {
      id: `viñeta-${Date.now()}`,
      points: [],
      fill: randomColor,
      closed: true,
      metadata: {
        order: (currentPanels.length + 1) * 10,
        chapter: 1,
        page: 1,
        panel: currentPanels.length + 1,
        createdAt: new Date().toISOString(),
        musicType: currentPanels[0]?.metadata.musicType || "feliz",
      },
    };

    setComicData((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        "1": {
          ...prev.chapters["1"],
          [nodeKey]: [...currentPanels, newPanel],
        },
      },
    }));
  };

  // Reordena las viñetas dentro de un nodo y actualiza sus metadatos
  const reorderPanels = (nodeIndex: number, newPanels: Panel[]) => {
    const nodeKey = (nodeIndex + 1).toString();

    const updatedPanels = newPanels.map((panel, index) => ({
      ...panel,
      metadata: {
        ...panel.metadata,
        panel: index + 1,
        order: (index + 1) * 10,
      },
    }));

    setComicData((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        "1": {
          ...prev.chapters["1"],
          [nodeKey]: updatedPanels,
        },
      },
    }));
  };

  // Elimina una viñeta específica de un nodo y reordena las restantes
  const deletePanel = (nodeIndex: number, panelId: string) => {
    const nodeKey = (nodeIndex + 1).toString();
    const chapter = comicData.chapters["1"];
    const currentPanels = chapter[nodeKey] || [];

    const filteredPanels = currentPanels.filter((panel) => panel.id !== panelId);
    const updatedPanels = filteredPanels.map((panel, index) => ({
      ...panel,
      metadata: {
        ...panel.metadata,
        panel: index + 1,
        order: (index + 1) * 10,
      },
    }));

    setComicData((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        "1": {
          ...prev.chapters["1"],
          [nodeKey]: updatedPanels,
        },
      },
    }));
  };

  // Elimina un nodo completo y reordena los nodos restantes
  const deleteNode = (nodeIndex: number) => {
    const nodeKey = (nodeIndex + 1).toString();
    const chapter = comicData.chapters["1"];
    const newChapter = { ...chapter };
    delete newChapter[nodeKey];

    const remainingNodes = Object.keys(newChapter).sort((a, b) => Number.parseInt(a) - Number.parseInt(b));
    const reorderedChapter: { [key: string]: Panel[] } = {};

    remainingNodes.forEach((oldKey, index) => {
      const newKey = (index + 1).toString();
      reorderedChapter[newKey] = newChapter[oldKey];
    });

    setComicData((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        "1": reorderedChapter,
      },
    }));
  };

  // Mueve una viñeta de un nodo a otro y actualiza los metadatos
  const movePanelToNode = (panelId: string, fromNodeIndex: number, toNodeIndex: number) => {
    const fromNodeKey = (fromNodeIndex + 1).toString();
    const toNodeKey = (toNodeIndex + 1).toString();
    const chapter = comicData.chapters["1"];

    const fromPanels = chapter[fromNodeKey] || [];
    const toPanels = chapter[toNodeKey] || [];

    const panelToMove = fromPanels.find((panel) => panel.id === panelId);
    if (!panelToMove) return;

    const updatedFromPanels = fromPanels.filter((panel) => panel.id !== panelId);
    const updatedToPanels = [
      ...toPanels,
      { ...panelToMove, metadata: { ...panelToMove.metadata, musicType: toPanels[0]?.metadata.musicType || "feliz" } },
    ];

    const reorderedFromPanels = updatedFromPanels.map((panel, index) => ({
      ...panel,
      metadata: { ...panel.metadata, panel: index + 1, order: (index + 1) * 10 },
    }));

    const reorderedToPanels = updatedToPanels.map((panel, index) => ({
      ...panel,
      metadata: { ...panel.metadata, panel: index + 1, order: (index + 1) * 10 },
    }));

    setComicData((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        "1": {
          ...prev.chapters["1"],
          [fromNodeKey]: reorderedFromPanels,
          [toNodeKey]: reorderedToPanels,
        },
      },
    }));
  };

  // Reordena los nodos intercambiando sus posiciones
  const reorderNodes = (activeIndex: number, overIndex: number) => {
    const chapter = comicData.chapters["1"];
    const nodeKeys = Object.keys(chapter).sort((a, b) => Number.parseInt(a) - Number.parseInt(b));
    
    const activeNodePanels = chapter[nodeKeys[activeIndex]];
    const overNodePanels = chapter[nodeKeys[overIndex]];
    
    const newChapter: { [key: string]: Panel[] } = {};
    
    nodeKeys.forEach((key, index) => {
      if (index === activeIndex) {
        newChapter[key] = overNodePanels;
      } else if (index === overIndex) {
        newChapter[key] = activeNodePanels;
      } else {
        newChapter[key] = chapter[key];
      }
    });

    setComicData((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        "1": newChapter,
      },
    }));
  };

  const value = {
    comicData,
    addNewNode,
    addPanelToNode,
    reorderPanels,
    deletePanel,
    deleteNode,
    movePanelToNode,
    reorderNodes,
    getNodesFromData,
  };

  return <ComicContext.Provider value={value}>{children}</ComicContext.Provider>;
}; 