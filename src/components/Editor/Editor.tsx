import NavBar from './Navbar' 
import Paginas from './Paginas'
import Viñetas from './Viñetas'
import Nodos from './Nodos'
import Musica from './Musica'
import Manga from './Manga'
import { useAppContext } from '../../context/AppContext'

const Editor = ({ config}: {pdfUrl:string | null; config: any;}) => {
  const { nodos, separador, musica, pdfUrl } = useAppContext()
  console.log("PDF URL:", pdfUrl)
  console.log("Config URL:", config)

  return (
    <div className="font-mono h-screen flex flex-col">
      {/* NavBar */}
      <div className="h-[10%]">
        <NavBar />
      </div>
      <div className="grid grid-cols-5 h-[90%]" >
        {/* Seleccionador de páginas */}  
        <Paginas pdfUrl={pdfUrl} config={config}/>
        {/* Opciones de herramientas */}
        <div className="col-span-1 bg-stone-900 border-r-4 border-stone-600 border-b-4">
          {separador ? <Viñetas /> : null}
          {nodos ? <Nodos /> : null}
          {musica ? <Musica /> : null}
        </div>
        {/* Página manga */}
        <div className="grid grid-rows-4 col-span-3 bg-stone-900">
          <div className="row-span-3 border-stone-600 border-r-4">
            <Manga pdfUrl={pdfUrl} config={config}/>
          </div>
          <div className="row-span-1 border-t-4 border-stone-600 border-b-4 border-r-4"></div>
        </div>
      </div>
    </div>
  )
}

export default Editor
