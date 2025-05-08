import { useEffect, useState } from 'react';
import PDFViewer from './PDFViewer';

export default function ViewerWidget({ config, pdfUrl }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [audio, setAudio] = useState(null);

  const pageConfig = config.pages.find(p => p.page === currentPage);

  useEffect(() => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }

    if (pageConfig?.audioUrl) {
      const newAudio = new Audio(pageConfig.audioUrl);
      newAudio.play();
      setAudio(newAudio);
    }
  }, [currentPage]);

  return (
    <div>
      <PDFViewer pdfUrl={pdfUrl} pageNumber={currentPage} />
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Anterior</button>
        <button onClick={() => setCurrentPage(p => Math.min(config.totalPages, p + 1))}>Siguiente</button>
      </div>
    </div>
  );
}
