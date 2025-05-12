import { Page, Document, pdfjs} from 'react-pdf'
import { usePageContext } from '../../context/PageContext'
import { useEffect } from 'react'
import * as pdfjsLib from "pdfjs-dist"


pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Paginas = ({pdfUrl, config}: {pdfUrl:string | null; config: any;}) => {
  console.log("PDF URL:", pdfUrl)
  const { numPages, setNumPages, setCurrentPage } = usePageContext()

  useEffect(() => {
    const load = async () => {
      try {
        if(pdfUrl === null) {
          throw new Error("No se ha proporcionado una URL de PDF")
        }
        const loadingTask = await pdfjsLib.getDocument(pdfUrl)
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages)
        setCurrentPage(1) 
      } catch (e) {
        console.error("Error obteniendo PDF", e)
      }
    }
    load()
  }, [])

  const SelectPage = () => {
    return Array.from({length: numPages}, (_,i) => {
      return (
        <div key={i + 1} className="row-span-1 flex h-[20%]  w-full">
          <button onClick={() => setCurrentPage(i + 1)} className='flex w-full justify-center items-center hover:bg-stone-800 rounded-full gap-10'>
            <Document file={pdfUrl} className="inline-block">
              <Page 
                pageNumber={i + 1} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={0.2}
                />
            </Document>
            <span className="text-white text-xl">Página {i + 1}</span>
          </button>
        </div>
      )
    })
  }

  return (
      <div className="bg-stone-900 border-x-4 border-b-4 border-stone-600 flex flex-wrap overflow-y-auto">
        {numPages > 0 ? SelectPage() : <span className="text-white text-xl">Cargando...</span>}
      </div>
  )
}
export default Paginas