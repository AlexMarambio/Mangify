const SeleccionManga = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Selecciona un Manga</h1>
      <p className="text-lg mb-4">Pronto podrás seleccionar tu manga favorito.</p>
      <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Volver al Inicio
      </button>
    </div>
  );
}
export default SeleccionManga;