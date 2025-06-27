import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Page, Document, pdfjs } from 'react-pdf';
import { usePageContext } from '../../context/PageContext';
import { useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useTheme } from "@/components/theme-provider"

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PaginasProps {
  pdfUrl: string | null;
  config: Record<string, unknown>; // puedes ajustar el tipo según tu uso real
}

const Paginas = ({ pdfUrl }: PaginasProps) => {
  const { numPages, setNumPages, setCurrentPage } = usePageContext();
  const { theme } = useTheme();

  useEffect(() => {
    const load = async () => {
      try {
        if (!pdfUrl) throw new Error('No se ha proporcionado una URL de PDF');
        console.log('Cargando PDF:', pdfUrl);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        setNumPages(pdf.numPages);
        setCurrentPage(1);
      } catch (e) {
        console.error('Error obteniendo PDF:', e);
      }
    };

    load();
  }, [pdfUrl]);

  const SelectPage = () => {
    return (
      Array.from({ length: numPages }, (_, i) => (
        <div key={i + 1} className="row-span-1 flex h-[20%] w-full">
        <Button
          onClick={() => setCurrentPage(i + 1)}
          className={`flex h-full w-full justify-center items-center gap-10 my-1 px-2 bg-transparent ${theme === 'dark' ? 'text-white hover:text-black' : 'text-black hover:text-white'}`}
          >
          <Document file={pdfUrl} className="inline-block">
            <Page
              pageNumber={i + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              height={1000}
              scale={0.2}
              />
            </Document>
            <span className="text-2xl">Página {i + 1}</span>
          </Button>
        </div>
      ))
    )
  }
    
  return (
    <ScrollArea className="h-full w-full">
      {numPages > 0 ? SelectPage() : <span className="text-3xl">Cargando...</span>}
    </ScrollArea>
  )
}
export default Paginas
