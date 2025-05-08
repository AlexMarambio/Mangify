import React from 'react';
import { createRoot } from 'react-dom/client';
import ViewerWidget from './components/ViewerWidget';

(async function () {
  // Obtener parámetros del iframe (ej: ?pdfUrl=...&configUrl=...)
  const params = new URLSearchParams(window.location.search);
  const pdfUrl = params.get('pdfUrl');
  const configUrl = params.get('configUrl');

  const config = await fetch(configUrl).then(r => r.json());

  const root = createRoot(document.getElementById('viewer-root'));
  root.render(<ViewerWidget pdfUrl={pdfUrl} config={config} />);
})();