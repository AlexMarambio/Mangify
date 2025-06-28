import ModalMenu from "./subComponents/ModalMenu"
import {ModeToggle} from "../mode-toggle";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { viñetasGlobal } from "./Viñetas";
import { usePageContext } from "../../context/PageContext";
import { useComic } from "../Timeline/ComicContext";

interface ShapeMetadata {
  order: number;
  chapter: number;
  page: number;
  panel: number;
  createdAt: string;
}

interface ComicShape {
  id: number;
  points: number[];
  fill: string;
  closed: boolean;
  metadata: ShapeMetadata;
}

interface NavBarProps {
  points: number[];
  setPoints: React.Dispatch<React.SetStateAction<number[]>>;
  shapes: ComicShape[];
  setShapes: React.Dispatch<React.SetStateAction<ComicShape[]>>;
  chapter: number;
}

const NavBar = ({ 
  points,
  setPoints,
  shapes,
  setShapes,
  chapter
}: NavBarProps) => {
  const { currentPage: page } = usePageContext();
  const { addNewNode, addPanelToNode, getNodesFromData, deletePanel } = useComic();

  const deleteLastShape = () => {
    // Elimina la última forma del canvas
    if (shapes.length > 0) {
      setShapes((prev) => {
        const newShapes = [...prev];
        newShapes.pop();
        return newShapes;
      });
    }
    // Elimina la última viñeta (panel) del primer nodo
    const nodes = getNodesFromData();
    if (nodes.length > 0 && nodes[0].panels.length > 0) {
      const lastPanel = nodes[0].panels[nodes[0].panels.length - 1];
      deletePanel(0, lastPanel.id);
    }
  };

  const finishShape = () => {
    if (points.length >= 6) {
      // Mínimo 3 puntos (x,y)
      const newShape: ComicShape = {
        id: Date.now(),
        points: [...points],
        fill: "rgba(50, 50, 50, 0.99)",
        closed: true,
        metadata: {
          order: shapes.length + 1,
          chapter,
          page,
          panel: viñetasGlobal,
          createdAt: new Date().toISOString(),
        },
      };
      setShapes((prev) => [...prev, newShape]);
      setPoints([]);

      // Asegurarse de que haya un nodo en la línea de tiempo
      if (shapes.length === 0) {
        addNewNode();
      }
      // Agregar la viñeta al primer nodo
      addPanelToNode(0);
    }
  };

  const clearLastPoint = () => {
    setPoints((prev) => prev.slice(0, -2));
  };

  const exportComicData = () => {
    // Obtener los nodos del contexto del cómic
    const nodes = getNodesFromData().map(node => ({
      id: `node-${node.nodeIndex}`, // Asegurar que tenga id
      name: `Nodo ${node.nodeIndex + 1}`,
      mood: "neutral",
      color: "bg-blue-500",
      start:  node.nodeIndex * 60,
      end:  (node.nodeIndex * 60) + 50
    }));

    // Organizar las formas (shapes) por páginas
    const pages: { [key: string]: any[] } = {};
    
    shapes.forEach(shape => {
      const pageKey = shape.metadata.page.toString();
      if (!pages[pageKey]) {
        pages[pageKey] = [];
      }

      // Encontrar el nodo asociado a esta viñeta (simplificado - puedes mejorar esta lógica)
      const associatedNode = nodes[0]; // Por defecto al primer nodo, ajusta según tu lógica
      
      pages[pageKey].push({
        id: shape.id,
        text: `Panel ${pages[pageKey].length + 1}`,
        order: shape.metadata.order,
        node: associatedNode.id,
        points: shape.points,
        fill: shape.fill,
        closed: shape.closed
      });
    });

    // Crear el objeto final del cómic
    const comicData = {
      metadata: {
        title: "Mi Cómic",
        chapter: chapter.toString(),
        author: "Tu Nombre",
        created: new Date().toISOString()
      },
      nodes,
      pages
    };

    // Copiar al portapapeles
    const jsonData = JSON.stringify(comicData, null, 2);
    navigator.clipboard.writeText(jsonData).catch((err) => {
      console.error("Error al copiar al portapapeles:", err);
    });

    // Descargar archivo
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comic-${comicData.metadata.chapter}-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`Datos del cómic exportados!\nCapítulo: ${chapter}`);
  };

  return (
    <div className="flex flex-row w-screen h-full items-center px-6 gap-x-6 justify-between">
      <div className="flex justify-center mx-5">
        <ModalMenu />
      </div>
      <div className="flex-grow text-center mr-5">
        <span className="text-5xl font-bold">Mangify</span>
      </div>
      <div className="flex items-center gap-x-2 mr-5">
        <Button 
          onClick={finishShape}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Finalizar Forma
        </Button>
        <Button 
          onClick={clearLastPoint}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Eliminar Punto
        </Button>
        <Button 
          onClick={deleteLastShape}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Eliminar Forma
        </Button>
        <Button 
          onClick={exportComicData}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Exportar
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
