import { useState } from "react"
import { Timeline, type TimelineNode, type TimelineMusic } from "../components/Editor2/timeline"
//import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Editor2/card"
import { Save } from "lucide-react"
import { Button } from "flowbite-react"
import Viñetas2 from "../components/Timeline/Viñetas2"
import { DndContext, closestCenter } from '@dnd-kit/core'

interface ComicVignette {
  id: string;
  points: number[];
  fill: string;
  closed: boolean;
  metadata: {
    order: number;
    chapter: number;
    page: number;
    panel: number;
    createdAt: string;
    musicType?: string;
  };
}

interface ComicData {
  metadata: {
    title: string
    author: string
    created: string
  }
  chapters: {
    [key: string]: {
      [key: string]: ComicVignette[]
    }
  }
}

type Vignette = {
  id: string;
  color: string;
  text: string;
};

export default function Home() {
  const [timelineData, setTimelineData] = useState<{
    nodes: TimelineNode[]
    music: TimelineMusic[]
  }>({
    nodes: [],
    music: [],
  })

  // Estado global para viñetas del lateral
  const [sideVignettes, setSideVignettes] = useState<any[]>([])

  const generateComicData = () => {
    const comicData: ComicData = {
      metadata: {
        title: "Mi Cómic",
        author: "Tu Nombre",
        created: new Date().toISOString(),
      },
      chapters: {},
    };

    let lastMusicType: string | undefined = undefined;

    timelineData.nodes.forEach((node) => {
      const pageKey = node.pageNumber.toString();
      const panelKey = node.panelNumber.toString();
      if (!comicData.chapters[pageKey]) {
        comicData.chapters[pageKey] = {};
      }
      if (!comicData.chapters[pageKey][panelKey]) {
        comicData.chapters[pageKey][panelKey] = [];
      }

      const sortedBullets = [...node.bulletPoints].sort((a, b) => a.position - b.position);

      sortedBullets.forEach((bp) => {
        const nodeMusic = timelineData.music.find(m => m.nodeId === node.id);
        let musicType: string | undefined = undefined;
        if (nodeMusic && nodeMusic.musicType !== lastMusicType) {
          musicType = nodeMusic.musicType;
          lastMusicType = nodeMusic.musicType;
        }
        const vignette = {
          id: bp.id,
          points: [],
          fill: node.color,
          closed: true,
          metadata: {
            order: bp.position,
            chapter: 1,
            page: node.pageNumber,
            panel: node.panelNumber,
            createdAt: new Date().toISOString(),
            ...(musicType ? { musicType } : {})
          }
        };
        comicData.chapters[pageKey][panelKey].push(vignette);
      });
    });
    return comicData;
  };

  const handleTimelineChange = (nodes: TimelineNode[], music: TimelineMusic[]) => {
    setTimelineData({ nodes, music })
  }

  const handleSave = () => {
    const comicData = generateComicData();
    // Copy to clipboard
    const jsonData = JSON.stringify(comicData, null, 2)
    navigator.clipboard.writeText(jsonData).catch((err) => {
      console.error("Error al copiar al portapapeles:", err)
    })
    // Download file
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "comic-timeline.json"
    a.click()
    URL.revokeObjectURL(url)
    alert("¡Datos de línea de tiempo guardados en formato de cómic!")
  }

  // Handler para drop de viñetas externas en Timeline
  const handleExternalVignetteDrop = (vignette: Vignette, nodeId: string) => {
    // Elimina la viñeta del lateral
    setSideVignettes((prev) => prev.filter((v) => v.id !== vignette.id));
    // Agrega la viñeta al nodo destino
    setTimelineData((prev) => {
      const nodes = prev.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            bulletPoints: [
              ...node.bulletPoints,
              {
                id: vignette.id,
                text: vignette.text,
                position: (node.start + node.end) / 2,
                nodeId: node.id,
                color: vignette.color,
              },
            ],
          };
        }
        return node;
      });
      return { ...prev, nodes };
    });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <DndContext collisionDetection={closestCenter}>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Editor interactivo de Línea de Tiempo </h1>
              <p className="text-gray-400 mt-1">Crea y administra paneles con música para tu cómic</p>
            </div>

            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              <Save size={16} className="mr-2" />
              Guardar Línea de Tiempo
            </Button>
          </div>

          <div className="flex flex-row gap-4">
            <div className="w-1/4">
              <Viñetas2 sideVignettes={sideVignettes} setSideVignettes={setSideVignettes} />
            </div>
            <div className="w-3/4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                  <CardDescription className="text-gray-400">
                    Arrastra paneles para reorganizarlos. Asigna música a cada panel arrastrando los elementos musicales o viñetas desde el lateral.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 max-h-[360px] overflow-y-auto">
                  <Timeline onChange={handleTimelineChange} sideVignettes={sideVignettes} setSideVignettes={setSideVignettes} onExternalVignetteDrop={handleExternalVignetteDrop} />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Instrucciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Arrastra los bordes de los paneles para cambiarlos de tamaño</li>
                  <li>Arrastra los elementos musicales para asignarlos a los paneles</li>
                  <li>Usa la barra de herramientas para agregar nuevos paneles</li>
                  <li>La línea de tiempo se ajusta automáticamente al tamaño de la pantalla</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Timeline Data</CardTitle>
              </CardHeader>
              <CardContent className="max-h-80 overflow-auto">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(generateComicData(), null, 2)}</pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </DndContext>
    </main>
  )
}
