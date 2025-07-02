import { Page, Document, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { usePageContext } from "../../context/PageContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const LoadingSkeleton = ({ width = 455, height = 555 }: { width?: number; height?: number }) => (
  <div className="h-full w-full overflow-hidden flex items-center justify-center">
    <div 
      className="bg-gray-200 animate-pulse rounded flex-shrink-0"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  </div>
);

const Manga = ({
  pdfUrl,
  setPdfSize,
  width = 600,
  height = 800,
}: {
  pdfUrl: string | null;
  setPdfSize: (size: { width: number; height: number }) => void;
  width?: number;
  height?: number;
}) => {
  const { currentPage } = usePageContext();
  const [escala, setEscala] = useState<number>();
  const [tamaño, setTamaño] = useState<number>(0);
  const [viewportWidth, setViewportWidth] = useState<number>(0);

  useEffect(() => {
    if (window.innerHeight < 1280) {
      setTamaño(450);
    } else if (window.innerHeight > 1280) {
      setTamaño(550);
    }

    if (viewportWidth && tamaño) {
      setEscala(tamaño / viewportWidth);
    }
  }, [viewportWidth, tamaño]);

  if (!pdfUrl) {
    return <LoadingSkeleton width={tamaño || 455} height={tamaño * 1.2 || 555} />;
  }

  return (
    <div className="h-full w-full overflow-hidden flex items-center justify-center">
      <Document
        file={pdfUrl}
        className="inline-block"
        onLoadSuccess={async (pdf) => {
          const page = await pdf.getPage(currentPage);
          const viewport = page.getViewport({ scale: 1 });
          setViewportWidth(viewport.width);
        }}
        loading={<LoadingSkeleton width={tamaño || 455} height={tamaño * 1.2 || 555} />}
      >
        <Page
          pageNumber={currentPage}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={escala}
          onRenderSuccess={(page) => {
            const viewport = page.getViewport();
            setPdfSize({ width: viewport.width, height: viewport.height });
          }}
          loading={<LoadingSkeleton width={tamaño || 455} height={tamaño * 1.2 || 555} />}
        />
      </Document>
    </div>
  );
};

export default Manga;