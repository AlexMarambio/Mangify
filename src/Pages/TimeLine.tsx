import { useState } from "react"
import { Timeline, type TimelineNode, type TimelineMusic } from "../components/Editor2/timeline"
//import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Editor2/card"
import { Save } from "lucide-react"
import { Button } from "flowbite-react"

export default function Home() {
  const [timelineData, setTimelineData] = useState<{
    nodes: TimelineNode[]
    music: TimelineMusic[]
  }>({
    nodes: [],
    music: [],
  })

  const handleTimelineChange = (nodes: TimelineNode[], music: TimelineMusic[]) => {
    setTimelineData({ nodes, music })
  }

  const handleSave = () => {
    console.log("Timeline data saved:", timelineData)
    // Here you would typically save to a database or API
    alert("¡Datos de línea de tiempo guardados en la consola!")
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Editor interactivo de Línea de Tiempo </h1>
            <p className="text-gray-400 mt-1">Crea y administra nodos de línea de tiempo con puntos y elementos musicales</p>
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
              Arrastra nodos y puntos para reorganizarlos. Cambia el tamaño de los elementos arrastrando sus bordes.
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
                <li>Arrastra los bordes de los nodos y elementos musicales para cambiarlos de tamaño</li>
                <li>Arrastra los puntos para moverlos entre nodos</li>
                <li>Usa la barra de herramientas para agregar nuevos nodos y puntos</li>
                <li>Haz clic en las pistas musicales para alternar entre reproducción/pausa (simulado)</li>
                <li>La línea de tiempo se ajusta automáticamente al tamaño de la pantalla</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Timeline Data</CardTitle>
            </CardHeader>
            <CardContent className="max-h-80 overflow-auto">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(timelineData, null, 2)}</pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
