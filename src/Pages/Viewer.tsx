import { useEffect, useState } from "react";
import ViewerWidget from "../components/Viewer/ViewerWidget";
import type { ViewerConfig } from "../components/Viewer/ViewerWidget";

const Viewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [config, setConfig] = useState<ViewerConfig | null>(null);

  useEffect(() => {
    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const pdfUrlParam = params.get("pdfUrl");
    const configUrlParam = params.get("configUrl");

    if (!pdfUrlParam || !configUrlParam) {
      console.error("Faltan parámetros: pdfUrl o configUrl");
      return;
    }

    setPdfUrl(pdfUrlParam);

    // Cargar configuración
    const fetchConfig = async () => {
      try {
        const response = await fetch(configUrlParam);
        if (!response.ok) {
          throw new Error(`Error al cargar config: ${response.statusText}`);
        }
        const configData = await response.json();
        setConfig(configData);
      } catch (error) {
        console.error("Error cargando el config:", error);
      }
    };

    fetchConfig();
  }, []);

  if (!pdfUrl || !config) {
    return <div>Cargando visor...</div>;
  }

  return (
    <div>
      <ViewerWidget pdfUrl={pdfUrl} config={config} />
    </div>
  );
};

export default Viewer;
