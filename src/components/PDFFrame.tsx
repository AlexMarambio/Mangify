import { Document, Page, pdfjs, type DocumentProps } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useRef, useEffect, useState } from 'react';
import type { RefObject } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function useContainerWidth(): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(800);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
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
  onDocumentLoadSuccess: DocumentProps['onLoadSuccess'];
}

export default function PDFFrame({ pdfUrl, pageNumber, onDocumentLoadSuccess }: PDFFrameProps) {
  const [containerRef, width] = useContainerWidth();

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          pageNumber={pageNumber}
          width={width}
          renderTextLayer={false}
        />
      </Document>
    </div>
  );
}
