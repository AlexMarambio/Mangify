import React from 'react';
import { createRoot } from 'react-dom/client';
import ViewerWidget from './components/ViewerWidget';

(async function () {
  const script = document.currentScript;
  const pdfUrl = script.dataset.pdfUrl;
  const configUrl = script.dataset.configUrl;

  const config = await fetch(configUrl).then(r => r.json());

  const container = document.createElement('div');
  script.parentNode.insertBefore(container, script.nextSibling);

  const root = createRoot(container);
  root.render(<ViewerWidget pdfUrl={pdfUrl} config={config} />);
})();
