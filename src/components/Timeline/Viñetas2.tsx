import { useState } from "react";
import { useDraggable, DragOverlay } from '@dnd-kit/core';
import React from "react";

type Vignette = {
  id: string;
  color: string;
  text: string;
};

const vignetteColors = ["#f472b6", "#f87171", "#a3e635", "#60a5fa", "#fb923c", "#34d399", "#818cf8"];

function VignetaDraggable({ vigneta, index }: { vigneta: Vignette; index: number }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: vigneta.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="relative flex w-20 h-20 rounded-full items-center justify-center mx-2 mb-2 cursor-grab"
      style={{ background: vigneta.color, opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="text-white text-2xl font-bold">{vigneta.text}</span>
    </div>
  );
}

const Viñetas2 = ({
  sideVignettes,
  setSideVignettes,
}: {
  sideVignettes: Vignette[];
  setSideVignettes: React.Dispatch<React.SetStateAction<Vignette[]>>;
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeVignette, setActiveVignette] = useState<Vignette | null>(null);

  // Handler para agregar viñeta
  const handleAdd = () => {
    const idx = sideVignettes.length;
    setSideVignettes([
      ...sideVignettes,
      {
        id: `side-${Date.now()}-${idx}`,
        color: vignetteColors[idx % vignetteColors.length],
        text: `Viñeta ${idx + 1}`,
      },
    ]);
  };
  // Handler para quitar viñeta
  const handleRemove = () => {
    setSideVignettes((prev: Vignette[]) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-full mb-4">
        <button className="m-2 px-5 py-3 rounded-full hover:bg-stone-800" onClick={handleAdd}>
          <span className="text-white text-xl">+</span>
        </button>
        <button className="m-2 px-5 py-3 rounded-full hover:bg-stone-800" onClick={handleRemove}>
          <span className="text-white text-xl">-</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2 justify-center overflow-y-auto max-h-[860px]">
        {sideVignettes.map((v: Vignette, i: number) => (
          <VignetaDraggable key={v.id} vigneta={v} index={i} />
        ))}
      </div>
      <DragOverlay>
        {activeVignette && (
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: activeVignette.color }}>
            <span className="text-white text-2xl font-bold">{activeVignette.text}</span>
          </div>
        )}
      </DragOverlay>
    </div>
  );
};
export default Viñetas2;

