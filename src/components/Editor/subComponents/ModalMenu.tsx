import React, { useState, useRef, useEffect } from "react";
import { Button } from "flowbite-react";
import "./ModalIcon.css";
import MangaCard from "./MangaCard";
import mangas from "../../../constants/mangas.ts";
import { useAppContext } from "../../../context/AppContext.tsx";
 // Asegúrate de que la ruta sea correcta

const HamburgerMenu: React.FC = () => {
  const {setPdfUrl} = useAppContext();

  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);

  const iconRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const secondModalRef = useRef<HTMLDivElement>(null);
  

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !iconRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isSecondModalOpen) {
      setShowSecondModal(true);
    } else {
      const timeout = setTimeout(() => setShowSecondModal(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isSecondModalOpen]);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        secondModalRef.current &&
        !secondModalRef.current.contains(event.target as Node)
      ) {
        setIsSecondModalOpen(false);
      }
    };

    if (isSecondModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideModal);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [isSecondModalOpen]);

  const handleSelectManga = (pdfUrl: string) => {
    setPdfUrl(pdfUrl);         // Guardamos la URL en contexto
    setIsSecondModalOpen(false);  // Cerramos modal
  };


  return (
    <div className="relative inline-block">
      <div
        id="nav-icon1"
        className={`cursor-pointer ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        ref={iconRef}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menú hamburguesa */}
      {shouldRender && (
        <div
          ref={menuRef}
          className={`absolute top-full mt-2 z-50 w-72 bg-gray-800 border rounded-lg shadow-lg p-4 transition-all duration-300 transform ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <Button
            className="mb-2 w-full"
            onClick={() => {
              setIsSecondModalOpen(true);
              setIsOpen(false);
            }}
          >
            <span className="text-xl text-white">Selecciona el Manga</span>
          </Button>
          <Button className="mb-2 w-full">
            <span className="text-xl text-white">Test</span>
          </Button>
          <Button className="mb-2 w-full">
            <span className="text-xl text-white">Test</span>
          </Button>
          <Button className="mb-2 w-full">
            <span className="text-xl text-white">Test</span>
          </Button>
        </div>
      )}

      {/* Segundo modal */}
     {showSecondModal && (
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
          isSecondModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div
          ref={secondModalRef}
          className={`w-full max-w-[90vw] md:max-w-[80vw] lg:max-w-[65vw] max-h-[80vh] bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 transform transition-transform duration-300 ${
            isSecondModalOpen ? "scale-100" : "scale-95"
          } flex flex-col`}
        >
          {/* Título fijo */}
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex-shrink-0">
            Selecciona tu Manga a Editar
          </h3>

          {/* Contenedor scrollable para las cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mb-4 p-4 overflow-y-auto max-h-[60vh]">
            {mangas.map((manga) => (
              <MangaCard
                key={manga.title}
                title={manga.title}
                imageUrl={manga.imageUrl}
                onClick={() => {
                  console.log("Seleccionaste:", manga.title);
                  handleSelectManga(manga.pdfUrl); // Llama a la función para manejar la selección
                  setIsSecondModalOpen(false);
                }}
              />
            ))}
          </div>

          {/* Botón fijo */}
          <div className="flex justify-start mt-4 flex-shrink-0">
            <Button onClick={() => setIsSecondModalOpen(false)}>Cancelar</Button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default HamburgerMenu;
