// import type React from "react"
// import { useState } from "react"
// //import { Music } from "lucide-react"
// import type { TimelineMusic, TimelineNode } from "./timeline"

// interface MusicTrackProps {
//   music: TimelineMusic[]
//   nodes: TimelineNode[]
//   timeToPixel: (time: number) => number
//   pixelToTime: (pixel: number) => number
//   onMusicResize: (musicId: string, start: number, end: number) => void
//   readOnly?: boolean
// }

// export function MusicTrack({
//   music,
//   nodes,
//   timeToPixel,
//   pixelToTime,
//   onMusicResize,
//   readOnly = false,
// }: MusicTrackProps) {
//   const [dragging, setDragging] = useState<{
//     type: "music-start" | "music-end"
//     id: string
//     initialPosition: number
//     initialValue: number
//   } | null>(null)

//   const [playingTrack, setPlayingTrack] = useState<string | null>(null)

//   // Handle mouse/touch down on music edge
//   const handleDragStart = (
//     e: React.MouseEvent | React.TouchEvent,
//     type: "music-start" | "music-end",
//     id: string,
//     initialValue: number,
//   ) => {
//     if (readOnly) return

//     e.preventDefault()
//     const clientX = "touches" in e ? e.touches[0].clientX : e.clientX

//     setDragging({
//       type,
//       id,
//       initialPosition: clientX,
//       initialValue,
//     })

//     // Add document-level event listeners
//     if ("touches" in e) {
//       document.addEventListener("touchmove", handleDragMove)
//       document.addEventListener("touchend", handleDragEnd)
//     } else {
//       document.addEventListener("mousemove", handleDragMove)
//       document.addEventListener("mouseup", handleDragEnd)
//     }
//   }

//   // Handle mouse/touch move during drag
//   const handleDragMove = (e: MouseEvent | TouchEvent) => {
//     if (!dragging) return

//     const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
//     const deltaPixels = clientX - dragging.initialPosition
//     const deltaTime = pixelToTime(deltaPixels)

//     if (dragging.type === "music-start") {
//       const musicTrack = music.find((m) => m.id === dragging.id)
//       if (musicTrack) {
//         const newStart = Math.max(0, dragging.initialValue + deltaTime)
//         if (newStart < musicTrack.end - 10) {
//           // Minimum track width
//           onMusicResize(dragging.id, newStart, musicTrack.end)
//         }
//       }
//     } else if (dragging.type === "music-end") {
//       const musicTrack = music.find((m) => m.id === dragging.id)
//       if (musicTrack) {
//         const newEnd = Math.max(musicTrack.start + 10, dragging.initialValue + deltaTime)
//         onMusicResize(dragging.id, musicTrack.start, newEnd)
//       }
//     }
//   }

//   // Handle mouse/touch up to end drag
//   const handleDragEnd = () => {
//     setDragging(null)
//     document.removeEventListener("mousemove", handleDragMove)
//     document.removeEventListener("mouseup", handleDragEnd)
//     document.removeEventListener("touchmove", handleDragMove)
//     document.removeEventListener("touchend", handleDragEnd)
//   }

//   // Toggle play/pause for music track
//   const togglePlayTrack = (trackId: string) => {
//     if (playingTrack === trackId) {
//       setPlayingTrack(null)
//     } else {
//       setPlayingTrack(trackId)
//     }
//   }

//   // Render node boundaries as background guides
//   const renderNodeBoundaries = () => {
//     return nodes.map((node) => {
//       const startPx = timeToPixel(node.start)
//       const endPx = timeToPixel(node.end)
//       const widthPx = endPx - startPx

//       return (
//         <div
//           key={`boundary-${node.id}`}
//           className="absolute h-full border-l border-r border-gray-600 border-dashed bg-gray-700 bg-opacity-20"
//           style={{
//             left: `${startPx}px`,
//             width: `${widthPx}px`,
//           }}
//         />
//       )
//     })
//   }

//   return (
//     <div className="relative h-16 md:h-20 w-full bg-gray-800 rounded-lg overflow-hidden">
//       {/* Render node boundaries */}
//       {renderNodeBoundaries()}

//       {/* Render music tracks */}
//       {music.map((musicTrack) => {
//         const startPx = timeToPixel(musicTrack.start)
//         const endPx = timeToPixel(musicTrack.end)
//         const widthPx = endPx - startPx

//         // Find the associated node to get its color
//         const node = nodes.find((n) => n.id === musicTrack.nodeId)
//         const colorClass = node ? node.color : "bg-green-500"
//         const isPlaying = playingTrack === musicTrack.id

//         // Buscar musicType en la metadata de la primera viñeta del nodo (si existe)
//         let musicType = musicTrack.musicType;
//         if (node && node.bulletPoints && node.bulletPoints.length > 0) {
//           const bulletWithMusic = node.bulletPoints.find(bp => typeof bp.metadata === 'object' && bp.metadata && bp.metadata.musicType);
//           if (bulletWithMusic && bulletWithMusic.metadata && bulletWithMusic.metadata.musicType) {
//             musicType = bulletWithMusic.metadata.musicType;
//           }
//         }

//         return (
//           <div
//             key={musicTrack.id}
//             className={`absolute h-10 md:h-12 top-3 md:top-4 ${colorClass} rounded-md flex items-center ${isPlaying ? "ring-2 ring-white" : ""}`}
//             style={{
//               left: `${startPx}px`,
//               width: `${widthPx}px`,
//             }}
//           >
//             {/* Music icon and title */}
//             <div className="flex items-center w-full px-2">
//               <div className="text-xs md:text-sm font-medium text-white truncate flex-1">{musicType}</div>
//             </div>

//             {!readOnly && (
//               <>
//                 {/* Left resize handle */}
//                 <div
//                   className="absolute left-0 h-full w-2 cursor-ew-resize group"
//                   onMouseDown={(e) => handleDragStart(e, "music-start", musicTrack.id, musicTrack.start)}
//                   onTouchStart={(e) => handleDragStart(e, "music-start", musicTrack.id, musicTrack.start)}
//                 >
//                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-white opacity-0 group-hover:opacity-50"></div>
//                 </div>

//                 {/* Right resize handle */}
//                 <div
//                   className="absolute right-0 h-full w-2 cursor-ew-resize group"
//                   onMouseDown={(e) => handleDragStart(e, "music-end", musicTrack.id, musicTrack.end)}
//                   onTouchStart={(e) => handleDragStart(e, "music-end", musicTrack.id, musicTrack.end)}
//                 >
//                   <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-0 group-hover:opacity-50"></div>
//                 </div>
//               </>
//             )}

//             {/* Triangle marker connecting to node */}
//             <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
//               <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/30"></div>
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }
