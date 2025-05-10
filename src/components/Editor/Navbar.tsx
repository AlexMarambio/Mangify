import { useAppContext } from "../../context/AppContext"

const NavBar = () => {
    const { nodos, setNodos, separador, setSeparador, musica, setMusica } = useAppContext()
    console.log("nodos:", nodos)
    console.log("separador:", separador)
    console.log("musica:", musica)
    return (
        <div className='grid grid-cols-16 bg-stone-900 w-screen h-[100px] items-center border-b-4 border-stone-600 gap-x-10'>
            <div className="col-span-2 flex justify-start" >
                <button className="m-2 px-5 py-3 rounded-xl hover:bg-stone-800 ml-10">
                    <svg className="fill-white size-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
                </button>
            </div>
            <div className="col-span-2 text-center">
                <button className="m-2 px-5 py-3 rounded-xl hover:bg-stone-800">
                    <span className='text-3xl text-white font-bold text-center' onClick={() => {setNodos(!nodos), setMusica(false), setSeparador(false)}}>Nodos</span>
                </button>
            </div>
            <div className="col-span-4 text-center">
                <button className="m-2 px-5 py-3 rounded-xl hover:bg-stone-800">
                    <span className='text-3xl text-white font-bold' onClick={() => {setSeparador(!separador), setNodos(false), setMusica(false)}}>Separador de viñetas</span>
                </button>
            </div>
            <div className="col-span-2 text-center">
                <button className="m-2 px-5 py-3 rounded-xl hover:bg-stone-800">
                    <span className='text-3xl text-white font-bold' onClick={() => {setMusica(!musica), setNodos(false), setSeparador(false)}}>Música</span>
                </button>
            </div>
            <div className="col-span-6 flex flex-row w-full text-center justify-center">
                <span className='text-5xl text-white font-bold'>Mangify</span> 
            </div>
        </div>
    )
}
export default NavBar