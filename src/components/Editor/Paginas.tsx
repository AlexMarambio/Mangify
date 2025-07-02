import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Page, Document, pdfjs } from 'react-pdf';
import { usePageContext } from '../../context/PageContext';
import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useTheme } from "@/components/theme-provider"

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PaginasProps {
  pdfUrl: string | null;
  config: Record<string, unknown>;
}

const Paginas = ({ pdfUrl }: PaginasProps) => {
  const { numPages, setNumPages, setCurrentPage, currentPage } = usePageContext();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (!pdfUrl) throw new Error('No se ha proporcionado una URL de PDF');
        console.log('Cargando PDF:', pdfUrl);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        setNumPages(pdf.numPages);
        setCurrentPage(1);
        setLoadedPages(new Set());
      } catch (e) {
        console.error('Error obteniendo PDF:', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [pdfUrl]);

  const handlePageLoad = (pageNumber: number) => {
    setLoadedPages(prev => new Set([...prev, pageNumber]));
  };

  const SelectPage = () => {
    return (
      Array.from({ length: numPages }, (_, i) => (
        <div key={i + 1} className="row-span-1 flex h-[10%] w-full">
          <Button
            onClick={() => setCurrentPage(i + 1)}
            className={`flex h-full w-full justify-center items-center gap-4 my-1 px-2 cursor-pointer ${
              currentPage === i + 1 
                ? 'text-black hover:text-white' 
                : `bg-transparent text-white hover:text-black`
            }`}
          >
            <div className="relative w-12 h-full flex-shrink-0">
              {!loadedPages.has(i + 1) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
              )}
              <Document 
                file={pdfUrl} 
                className="inline-block"
              >
                <Page
                  pageNumber={i + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={48}
                  onLoadSuccess={() => handlePageLoad(i + 1)}
                  loading=""
                  className={`transition-opacity duration-200 ${
                    loadedPages.has(i + 1) ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Document>
            </div>
            <span className="text-lg font-medium flex-shrink-0">{i + 1}</span>
          </Button>
        </div>
      ))
    )
  }

  const LoadingSkeleton = () => (
    Array.from({ length: 5 }, (_, i) => (
      <div key={`skeleton-${i}`} className="row-span-1 flex h-[10%] w-full">
        <div className="flex h-full w-full justify-center items-center gap-4 my-1 px-2">
          <div className="w-12 h-16 bg-gray-200 animate-pulse rounded flex-shrink-0"></div>
          <div className="w-6 h-6 bg-gray-200 animate-pulse rounded flex-shrink-0"></div>
        </div>
      </div>
    ))
  );

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-2">
        {loading ? (
          <div className="space-y-2">
            <LoadingSkeleton />
          </div>
        ) : numPages > 0 ? (
          <div className="space-y-1">
            {SelectPage()}
          </div>
        ) : (
          <div className="flex justify-center items-center h-32">
            <span className="text-lg text-gray-500">No hay páginas para mostrar</span>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

export default Paginas