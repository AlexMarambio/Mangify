import NavBar from '../components/Editor/Navbar' 
import Paginas from '../components/Editor/Paginas'
import Viñetas from '../components/Editor/Viñetas'
import Nodos from '../components/Editor/Nodos'
import Musica from '../components/Editor/Musica'
import Manga from '../components/Editor/Manga'
import { useAppContext } from '../context/AppContext'

function Editor() {
  const { nodos, setNodos, separador, setSeparador, musica, setMusica } = useAppContext()

  return (
    <div className="font-mono h-screen flex flex-col">
      {/* NavBar */}
      <NavBar />
      <div className="grid grid-cols-5 h-screen">
        {/* Seleccionador de páginas */}  
        <Paginas />
        {/* Opciones de herramientas */}
        <div className="col-span-1 bg-stone-900 border-r-4 border-stone-600 border-b-4">
          {separador ? <Viñetas /> : null}
          {nodos ? <Nodos /> : null}
          {musica ? <Musica /> : null}
        </div>
        {/* Página manga */}
        <div className="grid grid-rows-4 col-span-3 bg-stone-900">
          <div className="row-span-3 border-stone-600 border-r-4">
            <Manga />
          </div>
          <div className="row-span-1 border-t-4 border-stone-600 border-b-4 border-r-4"></div>
        </div>
      </div>
    </div>
  )
}

export default Editor
