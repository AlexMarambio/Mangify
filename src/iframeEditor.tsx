import { createRoot } from 'react-dom/client';
import { AppProvider } from './context/AppContext.tsx'
import { PageProvider } from './context/PageContext.tsx'
import Editor from './components/Editor/Editor';

(async function () {
  // Obtener parámetros del iframe (ej: ?pdfUrl=...&configUrl=...)
  const params = new URLSearchParams(window.location.search);
  const pdfUrl = params.get('pdfUrl');
  const configUrl = params.get('configUrl');

  if (!configUrl) {
    throw new Error("Falta el parámetro 'configUrl' en la URL");
  }

  const config = await fetch(configUrl).then(r => {
    if (!r.ok) throw new Error("Error al cargar config.json");
    return r.json();
  });

  const container = document.getElementById('editor-root');
  if (!container) {
    throw new Error("Elemento con id 'editor-root' no encontrado");
  }
  const root = createRoot(container);
  root.render(
    <AppProvider>
      <PageProvider>
        <Editor pdfUrl={pdfUrl} config={config} />
      </PageProvider>
    </AppProvider>
  );
})();
