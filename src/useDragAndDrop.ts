import { useState } from 'react';
import { useComic } from './components/Timeline/ComicContext';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';

// Hook para manejar toda la lógica de arrastrar y soltar
export const useDragAndDrop = () => {
  // elemento que se está arrastrando
  const [activeId, setActiveId] = useState<string | null>(null);
  // tipo de elemento que se está arrastrando (panel o nodo)
  const [activeDragType, setActiveDragType] = useState<string | null>(null);
  // elemento sobre el que se está arrastrando
  const [overId, setOverId] = useState<string | null>(null);
  
  const {
    deletePanel,
    deleteNode,
    movePanelToNode,
    reorderNodes,
  } = useComic();

  // Maneja el inicio del arrastre
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const dragData = event.active.data.current;
    setActiveDragType(dragData?.type || null);
  };

  // Maneja cuando un elemento se arrastra sobre otro
  const handleDragOver = (event: DragOverEvent) => {
    setOverId((event.over?.id as string) || null);
  };

  // Maneja el final del arrastre y ejecuta la acción correspondiente
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveDragType(null);
    setOverId(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Si se suelta en la zona de eliminación
    if (over.id === "delete-zone") {
      if (activeData?.type === "panel") {
        deletePanel(activeData.nodeIndex, active.id as string);
      } else if (activeData?.type === "node") {
        deleteNode(activeData.nodeIndex);
      }
      return;
    }

    // Si se mueve un panel a otro nodo
    if (activeData?.type === "panel" && overData?.type === "node-droppable") {
      if (activeData.nodeIndex !== overData.nodeIndex) {
        movePanelToNode(active.id as string, activeData.nodeIndex, overData.nodeIndex);
      }
      return;
    }

    // Si se reordenan los nodos
    if (activeData?.type === "node" && overData?.type === "node") {
      const activeIndex = activeData.nodeIndex;
      const overIndex = overData.nodeIndex;
      
      if (activeIndex !== overIndex) {
        reorderNodes(activeIndex, overIndex);
      }
      return;
    }
  };

  return {
    activeId,
    activeDragType,
    overId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}; 