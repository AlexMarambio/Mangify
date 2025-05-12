import { useEffect, useState } from 'react';
import PDFFrame from './PDFFrame';

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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(0.5);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const pageConfig = config.pages.find(p => p.page === currentPage);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function toggleAudio() {
    if (audio) {
      if (!isPaused) {
        audio.pause();
        setIsPaused(true);
      } else {
        audio.play().catch(console.warn);
        setIsPaused(false);
      }
    }
  }

  useEffect(() => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }

    if (pageConfig?.audioUrl) {
      const newAudio = new Audio(pageConfig.audioUrl);
      newAudio.volume = volume;
      setAudio(newAudio);

      const playAudio = () => {
        newAudio.play().catch(console.warn);
        document.removeEventListener('click', playAudio);
      };

      document.addEventListener('click', playAudio);

      // Cleanup (en caso de cambiar de página o desmontar)
      return () => {
        document.removeEventListener('click', playAudio);
        newAudio.pause();
      };
    }

  }, [pageConfig]);

  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, audio]);

  return (
    <div>
      <div style={{ width: `650px` }}>
        <PDFFrame
          pdfUrl={pdfUrl}
          pageNumber={currentPage}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
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
          <button onClick={toggleAudio}>pause/play</button>
        </span>
      </div>
    </div>
  );
}
