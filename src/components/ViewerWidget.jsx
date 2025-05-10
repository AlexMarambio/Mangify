import { useEffect, useState } from 'react';
import PDFFrame from './PDFViewer';

export default function ViewerWidget({ config, pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [audio, setAudio] = useState(null);
  const [volume, setVolume] = useState(0.5);
  let isPaused = false;

  const pageConfig = config.pages.find(p => p.page === currentPage);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  function pauseAudio () {
    if(audio){
      if(!isPaused){
        audio.pause().catch(console.warn);
        document.removeEventListener('click', playAudio);
        isPaused = true;
      }
      else{
        audio.play().catch(console.warn);
        document.removeEventListener('click', playAudio);
        isPaused = false;
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

      // autoplay solo si ya hubo interacción
      const playAudio = () => {
        newAudio.play().catch(console.warn);
        document.removeEventListener('click', playAudio);
      };
      
      document.addEventListener('click', playAudio);
    }
  }, [pageConfig]);

  return (
    <div>
      <div style={{width:`650px`}}>
        <PDFFrame
          pdfUrl={pdfUrl}
          pageNumber={currentPage}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage <= 1}>
          Anterior
        </button>
        <span style={{ margin: '0 1rem' }}>
          Página {currentPage} de {numPages || '?'}
        </span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))} disabled={currentPage >= numPages}>
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
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
              if (audio) audio.volume = newVolume;
            }}
          />
          <span>{Math.round(volume*100)}%</span>
        </label>
        <span>
            <button onClick={() => pauseAudio()}>
              pause/play
            </button>
          </span>
      </div>

    </div>
  );
}
