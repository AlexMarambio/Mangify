import { useState } from "react"
import { Timeline, type TimelineNode, type TimelineMusic } from "../components/Editor2/timeline"
//import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Editor2/card"
import { Save } from "lucide-react"
import { Button } from "flowbite-react"

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

export default function Home() {
  const [timelineData, setTimelineData] = useState<{
    nodes: TimelineNode[]
    music: TimelineMusic[]
  }>({
    nodes: [],
    music: [],
  })

  // Estado para mostrar el JSON final en la UI
  const [exportedComicData, setExportedComicData] = useState<any>(null);

  const handleTimelineChange = (nodes: TimelineNode[], music: TimelineMusic[]) => {
    setTimelineData({ nodes, music })
  }

  const handleSave = () => {
    // Convert timeline data to comic format
    const comicData: ComicData = {
      metadata: {
        title: "Mi Cómic",
        author: "Tu Nombre",
        created: new Date().toISOString(),
      },
      chapters: {},
    }

    // Para llevar el control del último musicType asignado
    let lastMusicType: string | undefined = undefined;

    // Organize nodes by page and panel
    timelineData.nodes.forEach((node) => {
      const pageKey = node.pageNumber.toString();
      const panelKey = node.panelNumber.toString();
      if (!comicData.chapters[pageKey]) {
        comicData.chapters[pageKey] = {};
      }
      if (!comicData.chapters[pageKey][panelKey]) {
        comicData.chapters[pageKey][panelKey] = [];
      }

      // Ordenar viñetas por posición (opcional, para mantener orden visual)
      const sortedBullets = [...node.bulletPoints].sort((a, b) => a.position - b.position);

      sortedBullets.forEach((bp) => {
        // Buscar si hay música asociada a este nodo
        const nodeMusic = timelineData.music.find(m => m.nodeId === node.id);
        let musicType: string | undefined = undefined;
        if (nodeMusic && nodeMusic.musicType !== lastMusicType) {
          musicType = nodeMusic.musicType;
          lastMusicType = nodeMusic.musicType;
        }
        // Construir la viñeta en el formato esperado
        const vignette = {
          id: bp.id,
          points: [], // Aquí deberías mapear los puntos reales de la viñeta si los tienes
          fill: node.color, // O el color real de la viñeta
          closed: true,
          metadata: {
            order: bp.position,
            chapter: 1, // Si tienes el capítulo real, cámbialo aquí
            page: node.pageNumber,
            panel: node.panelNumber,
            createdAt: new Date().toISOString(),
            ...(musicType ? { musicType } : {})
          }
        };
        comicData.chapters[pageKey][panelKey].push(vignette);
      });
    });

    // Mostrar el JSON final en la UI
    setExportedComicData(comicData);

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

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
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

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription className="text-gray-400">
              Arrastra paneles para reorganizarlos. Asigna música a cada panel arrastrando los elementos musicales.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 max-h-[360px] overflow-y-auto">
            <Timeline onChange={handleTimelineChange} />
          </CardContent>
        </Card>

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
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(exportedComicData || timelineData, null, 2)}</pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
