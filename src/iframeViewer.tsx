import { createRoot } from 'react-dom/client';
import ViewerWidget from './components/Viewer/ViewerWidget';
import type { ViewerConfig } from './components/Viewer/ViewerWidget';

(async function () {
  // Obtener parámetros del iframe (ej: ?pdfUrl=...&configUrl=...)
  const params = new URLSearchParams(window.location.search);
  const pdfUrl = params.get('pdfUrl');
  const configUrl = params.get('configUrl');

  if (!pdfUrl || !configUrl) {
    console.error('Faltan parámetros: pdfUrl o configUrl');
    return;
  }

  let config: ViewerConfig;

  try {
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(`Error al cargar config: ${response.statusText}`);
    }
    config = await response.json();
  } catch (error) {
    console.error('Error cargando el config:', error);
    return;
  }

  const container = document.getElementById('viewer-root');
  if (!container) {
    console.error('No se encontró el elemento #viewer-root');
    return;
  }

  const root = createRoot(container);
  root.render(<ViewerWidget pdfUrl={pdfUrl} config={config} />);
})();
