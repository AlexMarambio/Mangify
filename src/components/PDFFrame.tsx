import { Document, Page, pdfjs, type DocumentProps } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useRef, useEffect, useState } from "react";
import type { RefObject } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function useContainerWidth(): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(800);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

interface PDFFrameProps {
  pdfUrl: string;
  pageNumber: number;
  onDocumentLoadSuccess: DocumentProps["onLoadSuccess"];
  onSizeChange?: (size: { width: number; height: number }) => void; // NUEVO
}

export default function PDFFrame({
  pdfUrl,
  pageNumber,
  onDocumentLoadSuccess,
  onSizeChange,
}: PDFFrameProps) {
  const [containerRef, width] = useContainerWidth();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (pageRef.current && onSizeChange) {
        const rect = pageRef.current.getBoundingClientRect();
        onSizeChange({ width: rect.width, height: rect.height });
      }
    };
    const observer = new ResizeObserver(updateSize);
    if (pageRef.current) observer.observe(pageRef.current);
    return () => observer.disconnect();
  }, [onSizeChange]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", border: "1px solid black" }}
    >
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <div ref={pageRef}>
          <Page pageNumber={pageNumber} width={width} renderTextLayer={false} />
        </div>
      </Document>
    </div>
  );
}
