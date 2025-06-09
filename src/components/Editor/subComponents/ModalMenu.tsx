import React, { useState, useRef, useEffect } from "react";
import "./ModalIcon.css";
import MangaCard from "./MangaCard";
import mangas from "../../../constants/mangas.ts";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext.tsx";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
 // Asegúrate de que la ruta sea correcta

const HamburgerMenu: React.FC = () => {
  const {setPdfUrl} = useAppContext();
  const navigate = useNavigate();

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={`cursor-pointer ${isOpen ? "open" : ""} w-32 h-12 text-3xl`} onClick={toggleMenu}>
            Menu
          </Button>
        </DropdownMenuTrigger>
        {/* Menú hamburguesa */}
        <DropdownMenuContent className="mx-2 w-full">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Button onClick={() => navigate('/')} className=" text-xl w-full"> Home </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger>
                  <Button className="mb-2 mt-2 mx-2 w-full text-xl" /*onClick={() => {setIsSecondModalOpen(true);setIsOpen(false);}}*/>
                    Seleccionar manga
                  </Button>
                </DialogTrigger>
                <DialogContent className="
                  w-3xl max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 
                  max-h-[90vh] 
                  transform transition-transform duration-300 
                  flex flex-col
                  overflow-hidden
                  bg-black
                  border-white">
                  <DialogHeader>
                    <DialogTitle className="text-3xl">Selecciona el Manga a Editar</DialogTitle>
                    <DialogDescription className="text-xl">
                      Elige un manga de la lista para editarlo.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Contenedor scrollable para las cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 mb-2 sm:mb-4 p-2 sm:p-4 overflow-y-auto">
                    {mangas.map((manga) => (
                      <MangaCard
                        key={manga.title}
                        title={manga.title}
                        imageUrl={manga.imageUrl}
                        onClick={() => {
                          console.log("Seleccionaste:", manga.title);
                          handleSelectManga(manga.pdfUrl);
                        }}
                      />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuGroup>
      </DropdownMenuContent>
      </DropdownMenu>
  );
};

export default HamburgerMenu;
