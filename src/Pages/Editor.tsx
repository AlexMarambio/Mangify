import { useEffect, useState } from "react";
import { AppProvider } from "../context/AppContext.tsx";
import { PageProvider } from "../context/PageContext.tsx";
import EditorComponent from "../components/Editor/Editor";

const Editor = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular la obtención de parámetros (puedes ajustar esto según tu lógica)
    const params = new URLSearchParams(window.location.search);
    const pdfUrlParam = params.get("pdfUrl") || "/armadosMangify.pdf";
    const configUrl = params.get("configUrl") || "/testConfig.json";

    setPdfUrl(pdfUrlParam);

    // Cargar configuración
    fetch(configUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar config.json");
        return response.json();
      })
      .then((data) => setConfig(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!config || !pdfUrl) {
    return <div>Cargando...</div>;
  }

  return (
    <AppProvider>
      <PageProvider>
        <EditorComponent pdfUrl={pdfUrl} config={config} />
      </PageProvider>
    </AppProvider>
  );
};

export default Editor;
