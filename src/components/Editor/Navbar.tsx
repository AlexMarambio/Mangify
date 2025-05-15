import { useAppContext } from "../../context/AppContext"
import ModalMenu from "./subComponents/ModalMenu"

const NavBar = () => {
    const { nodos, setNodos, separador, setSeparador, musica, setMusica } = useAppContext();

    return (
        <div className="flex flex-row bg-stone-900 w-screen h-full items-center border-b-4 border-stone-600 px-6 gap-x-6 justify-between">
            {/* ModalMenu */}
            <div className="flex justify-center m-2">
                <ModalMenu />
            </div>

            {/* Botón Nodos */}
            <button
                className="m-2 px-10 py-3 rounded-xl hover:bg-stone-800"
                onClick={() => {
                setNodos(!nodos);
                setMusica(false);
                setSeparador(false);
                }}
            >
                <span className="text-2xl text-white font-bold text-center">Nodos</span>
            </button>

            {/* Botón Separador */}
            <button
                className="m-2 px-5 py-3 rounded-xl hover:bg-stone-800"
                onClick={() => {
                setSeparador(!separador);
                setNodos(false);
                setMusica(false);
                }}
            >
                <span className="text-2xl text-white font-bold">Separador de viñetas</span>
            </button>

            {/* Botón Música */}
            <button
                className="m-2 px-5 py-3 rounded-xl hover:bg-stone-800"
                onClick={() => {
                setMusica(!musica);
                setNodos(false);
                setSeparador(false);
                }}
            >
                <span className="text-2xl text-white font-bold">Música</span>
            </button>

            {/* Título */}
            <div className="flex-grow text-end m-2 px-5 py-3 ">
                <span className="text-5xl text-white font-bold">Mangify</span>
            </div>
        </div>
    );
};

export default NavBar;
