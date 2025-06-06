// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Timeline/Extra/card"
// import { Save } from "lucide-react"
// import { Button } from "flowbite-react"
// import Viñetas2 from "../components/Timeline/Viñetas2"
// import { DndContext, closestCenter } from '@dnd-kit/core'
// import { NodeCard } from "../components/Timeline/NodeCard"
// import { DeleteZone } from "../components/Timeline/DeleteZone"
// import { ComicProvider, useComic } from "../components/Timeline/ComicContext"
// import { useDragAndDrop } from "../useDragAndDrop"
// import { 
//   useSensor,
//   useSensors,
//   PointerSensor,
//   KeyboardSensor,
// } from "@dnd-kit/core"
// import { 
//   SortableContext, 
//   horizontalListSortingStrategy,
//   sortableKeyboardCoordinates
// } from "@dnd-kit/sortable"

// interface ComicVignette {
//   id: string;
//   points: number[];
//   fill: string;
//   closed: boolean;
//   metadata: {
//     order: number;
//     chapter: number;
//     page: number;
//     panel: number;
//     createdAt: string;
//     musicType?: string;
//   };
// }

// interface ComicData {
//   metadata: {
//     title: string
//     author: string
//     created: string
//   }
//   chapters: {
//     [key: string]: {
//       [key: string]: ComicVignette[]
//     }
//   }
// }

// type Vignette = {
//   id: string;
//   color: string;
//   text: string;
// };

// function TimeLineContent() {
//   // Estado para la pestaña activa
//   const [activeTab, setActiveTab] = useState("nodos")
  
//   // Obtenemos las funciones del contexto del cómic
//   const { addNewNode, addPanelToNode, getNodesFromData, reorderPanels, deletePanel, comicData } = useComic()
  
//   // Obtenemos las funciones y estados del hook de drag and drop
//   const { activeId, activeDragType, overId, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop()

//   // Configuramos los sensores para el drag and drop
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     }),
//   )

//   const nodes = getNodesFromData()
//   const isDragging = activeId !== null

//   const handleSave = () => {
//     const jsonData = JSON.stringify(comicData, null, 2)
//     navigator.clipboard.writeText(jsonData).catch((err) => {
//       console.error("Error al copiar al portapapeles:", err)
//     })
//     const blob = new Blob([jsonData], { type: "application/json" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = "comic-timeline.json"
//     a.click()
//     URL.revokeObjectURL(url)
//     alert("¡Datos de línea de tiempo guardados en formato de cómic!")
//   }

//   return (
//     <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragStart={handleDragStart}
//         onDragOver={handleDragOver}
//         onDragEnd={handleDragEnd}
//       >
//         <div className="max-w-6xl mx-auto space-y-8">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold">Editor interactivo de Línea de Tiempo </h1>
//               <p className="text-gray-400 mt-1">Crea y administra paneles con música para tu cómic</p>
//             </div>

//             <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
//               <Save size={16} className="mr-2" />
//               Guardar Línea de Tiempo
//             </Button>
//           </div>

//           <div className="flex flex-row gap-4">
//             <div className="w-1/4">
//               <Viñetas2 />
//             </div>
//             <div className="w-3/4">
//               <Card className="bg-gray-900 border-gray-800">
//                 <CardHeader>
//                   <CardTitle>Timeline</CardTitle>
//                   <CardDescription className="text-gray-400">
//                     Arrastra paneles para reorganizarlos. Asigna música a cada panel arrastrando los elementos musicales o viñetas desde el lateral.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="p-4 max-h-[360px] overflow-y-auto">
//                   <div className="overflow-x-auto pb-2">
//                     <div className="flex space-x-6 min-w-max">
//                       <SortableContext
//                         items={nodes.map((_, index) => `node-${index}`)}
//                         strategy={horizontalListSortingStrategy}
//                       >
//                         {nodes.map((node) => (
//                           <NodeCard
//                             key={`node-${node.nodeIndex}`}
//                             nodeIndex={node.nodeIndex}
//                             panels={node.panels}
//                             musicType={node.musicType}
//                             onAddPanel={addPanelToNode}
//                             onReorderPanels={reorderPanels}
//                             onDeletePanel={deletePanel}
//                             isOver={overId === `node-droppable-${node.nodeIndex}`}
//                           />
//                         ))}
//                       </SortableContext>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           {isDragging && (
//             <div className="fixed z-50 bottom-0 left-0 right-0 h-20 transition-all duration-300 bg-red-500/20 border-t-2 border-red-500">
//               <DeleteZone isActive={isDragging} dragType={activeDragType} />
//             </div>
//           )}
//         </div>
//       </DndContext>
//     </main>
//   )
// }

// export default function TimeLine() {
//   return (
//     <ComicProvider>
//       <TimeLineContent />
//     </ComicProvider>
//   )
// }
