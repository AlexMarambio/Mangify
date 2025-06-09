import { Page, Document, pdfjs } from "react-pdf";
import { useEffect, useState} from "react";
import { usePageContext } from "../../context/PageContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Manga = ({pdfUrl, setPdfSize,}: {pdfUrl: string | null; setPdfSize: (size: { width: number; height: number }) => void;}) => {
  const {currentPage} = usePageContext();
  const [escala, setEscala] = useState<number>();
  const [tamaño, setTamaño] = useState<number>(0);
  const [viewportWidth, setViewportWidth] = useState<number>(0)
  
  useEffect(() => {
    if (window.innerHeight < 1280) {
      setTamaño(450)
    } else if (window.innerHeight > 1280) {
      setTamaño(550)
    }

    if (viewportWidth && tamaño) {
      setEscala(tamaño / viewportWidth);
    }
  }, [viewportWidth, tamaño]);
  
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
        />
      </Document>
    </div>
  )
}
export default Manga