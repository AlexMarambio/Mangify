import MusicSearch from "./MusicSearch";
// const Musica = () => {
//     return (
//         null
//     )
// }
// export default Musica

interface MusicEditorProps {
  activePage: number;
}

// interface Page {
//   id: number
//   title: string
//   content: string
// }

/*

 */
const MusicEditor: React.FC<MusicEditorProps> = ({ activePage }) => {
  return (
    <div className="p-2 h-1 flex ">
      <div className="mr-4 w-100 ">
        <div className="h-flex bg-gray-900 text-white text-center border-2 border-blue-900">
          <h2 className="text-lg font-semibold mb-4 p-1">Editor de Musica</h2>
          <div className=" p-2 rounded">
            <MusicSearch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicEditor;

/*
const MusicEditor: React.FC<MusicEditorProps> = ({ activePage }) => {
  return (
    <div className="p-4 h-full flex">
      <div className="mr-4 w-64">
        <h2 className="text-lg font-semibold mb-4">Editor de Música - Página {activePage}</h2>
        <div className="bg-gray-800 p-4 rounded">
          <p className="text-gray-400 mb-4">Añade música a tu manga para mejorar la experiencia del lector.</p>
          <div className="space-y-2">
            <div className="bg-gray-700 p-2 rounded">
              <p className="text-sm">Track 1 - Intro</p>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <p className="text-sm">Track 2 - Action</p>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <p className="text-sm">Track 3 - Suspense</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
*/
