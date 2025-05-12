import { useEffect, useState } from 'react';
import PDFFrame from '../PDFFrame';
import { usePageAudio } from './AudioServer';

interface PageConfig {
  page: number;
  audioUrl?: string;
}

export interface ViewerConfig {
  pages: PageConfig[];
}

interface ViewerWidgetProps {
  config: ViewerConfig;
  pdfUrl: string;
}

export default function ViewerWidget({ config, pdfUrl }: ViewerWidgetProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.5);

  const pageConfig = config.pages.find(p => p.page === currentPage);

  const { toggleAudio, isPaused } = usePageAudio(volume, pageConfig?.audioUrl);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <div style={{ width: `650px` }}>
        <PDFFrame
          pdfUrl={pdfUrl}
          pageNumber={currentPage}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
        />
      </div>

      <div className='bg-red-500' style={{ marginTop: '1rem' }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage <= 1}
        >
          Anterior
        </button>
        <span style={{ margin: '0 1rem' }}>
          Página {currentPage} de {numPages || '?'}
        </span>
        <button
          onClick={() =>
            setCurrentPage(p =>
              Math.min(p + 1, numPages ?? Number.MAX_SAFE_INTEGER)
            )
          }
          disabled={!!numPages && currentPage >= numPages}
        >
          Siguiente
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Volumen:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
          />
          <span>{Math.round(volume * 100)}%</span>
        </label>
        <span>
          <button onClick={toggleAudio}>{isPaused ? 'Play' : 'Pause'}</button>
        </span>
      </div>
    </div>
  );
}
