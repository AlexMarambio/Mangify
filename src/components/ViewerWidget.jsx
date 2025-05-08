import { useEffect, useState } from 'react';
import PDFFrame from './PDFViewer';

export default function ViewerWidget({ config, pdfUrl }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [audio, setAudio] = useState(null);

  const pageConfig = config.pages.find(p => p.page === currentPage);

  useEffect(() => {
    const handleInteraction = () => {
      if (pageConfig?.audioUrl) {
        const audio = new Audio(pageConfig.audioUrl);
        audio.play();
      }
      document.removeEventListener('click', handleInteraction);
    };
  
    document.addEventListener('click', handleInteraction);
    return () => document.removeEventListener('click', handleInteraction);
  }, [pageConfig]);
  

  return (
    <div>
      <PDFFrame pdfUrl={pdfUrl}/>
    </div>
  );
}
