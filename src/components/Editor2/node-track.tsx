// import React from "react"
// import { Stage, Layer, Rect, Circle, Text } from "react-konva"
// import type { TimelineNode } from "./timeline"

// interface NodeTrackProps {
//   nodes: TimelineNode[];
//   timeToPixel: (time: number) => number;
//   pixelToTime: (pixel: number) => number;
//   onNodeResize?: (nodeId: string, start: number, end: number) => void;
//   onBulletPointDrag: (bulletPointId: string, position: number, newNodeId: string) => void;
//   readOnly?: boolean;
// }

// const getKonvaColor = (tailwindColor: string) => {
//   switch (tailwindColor) {
//     case "bg-emerald-500": return "#10b981";
//     case "bg-violet-500": return "#8b5cf6";
//     case "bg-red-500": return "#ef4444";
//     case "bg-blue-500": return "#3b82f6";
//     case "bg-green-500": return "#22c55e";
//     default: return "#888";
//   }
// };

// export function NodeTrack({
//   nodes,
//   timeToPixel,
//   pixelToTime,
//   onBulletPointDrag,
//   readOnly = false,
// }: NodeTrackProps) {
//   const nodeHeight = 128;
//   const stageHeight = nodeHeight; // Espacio extra para viñetas y etiquetas
//   const stageWidth = nodes.length > 0 ? timeToPixel(nodes[nodes.length - 1].end) + 60 : 1000;

//   return (
//     <div className="w-full">
//       <Stage width={stageWidth} height={stageHeight}>
//         <Layer>
//           {nodes.map((node) => {
//             const y = 0; // Todos los nodos en la misma línea
//             const startPx = timeToPixel(node.start);
//             const endPx = timeToPixel(node.end);
//             const widthPx = endPx - startPx;

//             return (
//               <React.Fragment key={node.id}>
//                 {/* Nodo */}
//                 <Rect
//                   x={startPx}
//                   y={y}
//                   width={widthPx}
//                   height={nodeHeight}
//                   fill={getKonvaColor(node.color)}
//                   opacity={0.5}
//                   cornerRadius={8}
//                 />
//                 {/* Título del nodo */}
//                 <Text
//                   x={startPx + 8}
//                   y={y + 6}
//                   text={node.title}
//                   fontSize={14}
//                   fill="#fff"
//                 />
//                 {/* Viñetas */}
//                 {node.bulletPoints.map((bp) => (
//                   <Circle
//                     key={bp.id}
//                     x={timeToPixel(bp.position)}
//                     y={y + nodeHeight / 2}
//                     radius={12}
//                     fill="#ec4899"
//                     stroke="#fff"
//                     strokeWidth={2}
//                     draggable={!readOnly}
//                     onDragEnd={e => {
//                       const newX = e.target.x();
//                       const newPosition = pixelToTime(newX);
//                       // Detectar el nodo sobre el que se soltó la viñeta
//                       const newNode = nodes.find(n =>
//                         newPosition >= n.start && newPosition <= n.end
//                       );
//                       if (newNode) {
//                         onBulletPointDrag(bp.id, newPosition, newNode.id);
//                       }
//                     }}
//                   />
//                 ))}
//                 {/* Etiquetas de viñetas */}
//                 {node.bulletPoints.map((bp) => (
//                   <Text
//                     key={bp.id + "-label"}
//                     x={timeToPixel(bp.position) - 20}
//                     y={y + nodeHeight / 2 + 16}
//                     text={bp.text}
//                     fontSize={12}
//                     fill="#fff"
//                   />
//                 ))}
//               </React.Fragment>
//             );
//           })}
//         </Layer>
//       </Stage>
//     </div>
//   );
// }
