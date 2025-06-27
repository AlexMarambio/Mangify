import { Page, Document, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { usePageContext } from "../../context/PageContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
  useEffect(() => {
    const height = window.innerHeight;
    if (height <= 1280) {
      setEscala(1);
    } else if (height > 1280) {
      setEscala(1.2);
    }
  }, []);

  return (
    <div className="h-full w-full overflow-hidden flex items-center justify-center">
      <Document file={pdfUrl} className="inline-block">
        <Page
          pageNumber={currentPage}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={escala}
          onRenderSuccess={(page) => {
            const viewport = page.getViewport();
            setPdfSize({
              width: viewport.width * (600 / width),
              height: viewport.height * (800 / height),
            });
          }}
        />
      </Document>
    </div>
  );
};
export default Manga;
