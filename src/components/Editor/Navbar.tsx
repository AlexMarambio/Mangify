import { useAppContext } from "../../context/AppContext"
import ModalMenu from "./subComponents/ModalMenu"

const NavBar = () => {
    const { nodos, setNodos, separador, setSeparador, musica, setMusica } = useAppContext();

    return (
        <div className="flex bg-stone-900 w-screen h-full items-center border-b-4 border-stone-600">
            <div className='grid grid-cols-16 gap-x-10 items-center'>
                <div className="col-span-2 flex justify-center" >
                    <ModalMenu/>
                </div>
                <div className="col-span-2 text-center">
                    <button className="m-2 px-5 py-3 rounded-xl hover:bg-stone-800" onClick={() => {setNodos(!nodos), setMusica(false), setSeparador(false)}}>
                        <span className='text-3xl text-white font-bold text-center'>Nodos</span>
                    </button>
                </div>
                <div className="col-span-4 text-center">
                    <button className="m-2 px-5 py-3 rounded-xl hover:bg-stone-800" onClick={() => {setSeparador(!separador), setNodos(false), setMusica(false)}}>
                        <span className='text-3xl text-white font-bold'>Separador de viñetas</span>
                    </button>
                </div>
                <div className="col-span-2 text-center">
                    <button className="m-2 px-5 py-3 rounded-xl hover:bg-stone-800" onClick={() => {setMusica(!musica), setNodos(false), setSeparador(false)}}>
                        <span className='text-3xl text-white font-bold'>Música</span>
                    </button>
                </div>
                <div className="col-span-6 flex flex-row w-full text-center justify-center">
                    <span className='text-5xl text-white font-bold'>Mangify</span> 
                </div>
            </div>
        </div>
    );
};

export default NavBar;
