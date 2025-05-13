import React, { useState, useRef, useEffect } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import "./ModalIcon.css";
import MangaCard from "./MangaCard";

const mangas = [
  {
    title: "Naruto",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
  },
  {
    title: "One Piece",
    imageUrl: "https://i.pinimg.com/736x/01/7e/2f/017e2f2db03a579590f38c8fff990cba.jpg",
  },
  {
    title: "Bleach",
    imageUrl: "https://i1.whakoom.com/small/14/3b/9912856911ab4451ab71bb367337608c.jpg",
  },
  {
    title: "Armados",
    imageUrl: "https://dthezntil550i.cloudfront.net/ue/current/ue2007251125458030004683825/7114d736-5540-4164-9907-24bdb931cf95_m.jpg"
  }
];


const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false); // NUEVO para animación

  const iconRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const secondModalRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // --- Animación para el menú hamburguesa ---
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

  // --- Animación para el segundo modal ---
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

  return (
    <div className="relative inline-block">
      <div
        id="nav-icon1"
        className={isOpen ? "open" : ""}
        onClick={toggleMenu}
        ref={iconRef}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menú hamburguesa con transición */}
      {shouldRender && (
        <div
          ref={menuRef}
          className={`absolute top-full mt-2 z-50 w-100 bg-gray-800 border rounded-lg shadow-lg p-4 transition-all duration-300 transform ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <Button
            className="mb-2"
            onClick={() => {
              setIsSecondModalOpen(true);
              setIsOpen(false);
            }}
          >
            <h3 className="text-3xl font-medium text-white cursor-pointer">
              Selecciona el Manga
            </h3>
          </Button>
          <Button className="mb-2">
            <h3 className="text-3xl font-medium text-white cursor-pointer">
              Test
            </h3>
          </Button>
          <Button className="mb-2">
            <h3 className="text-3xl font-medium text-white cursor-pointer">
              Test
            </h3>
          </Button>
          <Button className="mb-2">
            <h3 className="text-3xl font-medium text-white cursor-pointer">
              Test
            </h3>
          </Button>
        </div>
      )}

      {/* Segundo modal con animación al abrir y cerrar */}
      {showSecondModal && (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                isSecondModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
            <div
                ref={secondModalRef}
                className={` w-100 overflow-y-auto bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 transform transition-transform duration-300 ${
                isSecondModalOpen ? "scale-100" : "scale-95"
                }`}
            >
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Selecciona tu Manga a Editar
                </h3>

                <div className="flex flex-wrap gap-2 justify-evenly mb-4"> 
                {mangas.map((manga) => (
                    <MangaCard
                        key={manga.title}
                        title={manga.title}
                        imageUrl={manga.imageUrl}
                        onClick={() => {
                        console.log("Seleccionaste:", manga.title);
                        setIsSecondModalOpen(false);
                        }}
                    />
                ))}
                </div>

                <Button onClick={() => setIsSecondModalOpen(false)}>Cancelar</Button>
            </div>
        </div>



      )}
    </div>
  );
};

export default HamburgerMenu;
