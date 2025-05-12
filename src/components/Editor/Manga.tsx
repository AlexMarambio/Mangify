import { Page, Document, pdfjs} from 'react-pdf'
import { usePageContext } from '../../context/PageContext'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const Manga = ({pdfUrl, config}: {pdfUrl:string | null; config: any;}) => {
    const { numPages, setNumPages, currentPage, setCurrentPage } = usePageContext()
    
    return (
        <div className="h-full w-full overflow-hidden bg-stone-900 flex items-center justify-center">
            <Document 
                file={pdfUrl}
                className="inline-block"
            >
                <Page 
                    pageNumber={currentPage} 
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    scale={1.2}
                />
            </Document>
        </div>
    )
}
export default Manga