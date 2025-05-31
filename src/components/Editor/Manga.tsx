import { Page, Document, pdfjs } from "react-pdf";
import { usePageContext } from "../../context/PageContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Manga = ({
  pdfUrl,
  config,
  setPdfSize,
}: {
  pdfUrl: string | null;
  config: any;
  setPdfSize: (size: { width: number; height: number }) => void;
}) => {
  const {currentPage} = usePageContext();

  return (
    <div className="h-full w-full overflow-hidden bg-stone-900 flex items-center justify-center">
      <Document file={pdfUrl} className="inline-block">
        <Page
          pageNumber={currentPage}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={1.2}
          onRenderSuccess={(page) => {
            const viewport = page.getViewport({ scale: 1.2 });
            setPdfSize({ width: viewport.width, height: viewport.height });
          }}
        />
      </Document>
    </div>
  );
};
export default Manga;
