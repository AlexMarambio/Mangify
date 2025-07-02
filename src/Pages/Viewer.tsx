import { useEffect, useState } from "react";
import ViewerWidget from "../components/Viewer/ViewerWidget";
import type { ComicData } from "../components/Viewer/ViewerWidget";

const Viewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [config, setConfig] = useState<ComicData | null>(null);

  useEffect(() => {
    // Obtener parámetros de la URL
    const json = localStorage.getItem("comic-latest");
    let pdfUrl: string | null = null;
    if (json) {
      try {
        const comicData = JSON.parse(json);
        pdfUrl = comicData.metadata.title; // Asumiendo que el PDF está en metadata.title
      } catch (error) {
        console.error("Error al parsear comic-latest:", error);
      }
    }

    if (!pdfUrl) {
      console.error("Faltan parámetros: pdfUrl o configUrl");
      return;
    }

    console.log("PDF URL:", pdfUrl);

    setPdfUrl(pdfUrl);

    // Cargar configuración
    //   const fetchConfig = async () => {
    //     try {
    //       const mangaData = localStorage.getItem("comic-latest");
    //       if (!mangaData) {
    //         throw new Error("No se encontró mangaData en localStorage");
    //       }
    //       const configData = JSON.parse(mangaData);
    //       setConfig(configData);
    //     } catch (error) {
    //       console.error("Error cargando el config:", error);
    //     }
    //   };

    //   fetchConfig();
  }, []);

  if (!pdfUrl) {
    return <div>Cargando visor...</div>;
  }

  return (
    <div>
      <ViewerWidget pdfUrl={pdfUrl} />
    </div>
  );
};

export default Viewer;
