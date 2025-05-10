import { Page, Document, pdfjs} from 'react-pdf'
import { useState, useEffect, useRef } from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const Manga = () => {
    const [numPages, setNumPages] = useState<number>(0)
    const [pageNumber, setPageNumber] = useState<number>(1)

    const onDocumentLoadSuccess = ({ numPages }: {numPages: number}) => {
        setNumPages(numPages)
        setPageNumber(1)
    }

    return (
        <div className="h-full w-full overflow-hidden bg-stone-900 flex items-center justify-center">
            <Document 
                file="../../armadosMangify.pdf" 
                onLoadSuccess={onDocumentLoadSuccess} 
                className="inline-block"
            >
                <Page 
                    pageNumber={pageNumber} 
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    scale={1.4}
                />
            </Document>
        </div>
    )
}
export default Manga