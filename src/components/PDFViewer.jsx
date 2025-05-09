import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useRef, useEffect, useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function useContainerWidth() {
  const ref = useRef();
  const [width, setWidth] = useState(800);

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

export default function PDFFrame({ pdfUrl, pageNumber, onDocumentLoadSuccess }) {
  const [containerRef, width] = useContainerWidth();

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={width} renderTextLayer={false}/>
      </Document>
    </div>
  );
}
