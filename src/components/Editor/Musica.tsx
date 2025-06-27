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
    <div className="w-[90%] mt-6">
      <MusicSearch />
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
