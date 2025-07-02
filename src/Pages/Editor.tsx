import { useEffect, useState } from "react";
import { PageProvider } from "../context/PageContext.tsx";
import EditorComponent from "../components/Editor/Editor";
import { useAppContext } from "../context/AppContext.tsx";


const Editor = () => {
  const { pdfUrl } = useAppContext();
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Obtener los parámetros una sola vez
  const params = new URLSearchParams(window.location.search);
  const pdfUrlParam = params.get("pdfUrl") || "/armadosMangify.pdf";
  const configUrl = params.get("configUrl") || "/testConfig.json";

  useEffect(() => {
    // Cargar configuración
    fetch(configUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar config.json");
        return response.json();
      })
      .then((data) => setConfig(data))
      .catch((err) => setError(err.message));
  }, [configUrl]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Usar pdfUrl si existe, si no, usar pdfUrlParam
  const finalPdfUrl = pdfUrl || pdfUrlParam;

  if (!config || !finalPdfUrl) {
    return <div>Cargando...</div>;
  }

  return (
      <PageProvider>
        <EditorComponent pdfUrl={finalPdfUrl} config={config} />
      </PageProvider>
  );
};

export default Editor;
