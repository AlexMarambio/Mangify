import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  const PdfUrl = "/api/mangas/armados_Mangify.pdf";

  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className="brightness-25 w-full h-full bg-fixed absolute inset-0 bg-[url('/FondoIndex.webp')] bg-no-repeat blur-sm"
        style={{
          backgroundSize: "cover",
        }}
      ></div>
      <div className="absolute z-11 top-0 inset-x-0 justify-center flex items-center h-1/2 mask-center mask-contain mask-[url('/360852603_11441911.png')]">
        <h1 className="text-black text-8xl bg-stone-50 p-[200px] font-serif">
          Mangify
        </h1>
      </div>
      <div className="flex space-x-4 z-10 text-3xl bg-stone-800 p-10 rounded-lg shadow-xl shadow-stone-50/50 ring-3 ring-stone-50/50">
        <button
          onClick={() =>
            handleNavigation(
              // "/editor?pdfUrl=/armadosMangify.pdf&configUrl=/testConfig.json" // url antigua
              //"/editor?pdfUrl=http://192.168.100.12:3001/mangas/armados_Mangify.pdf&configUrl=/testConfig.json"
              "/editor?pdfUrl=/api/mangas/armados_Mangify.pdf&configUrl=/testConfig.json"
            )
          }
          className="px-6 py-3 bg-stone-50 text-black rounded-lg shadow-xl shadow-stone-50/50 hover:scale-150 hover:-translate-x-10 transition cursor-pointer blur-none"
        >
          Editor
        </button>
        <button
          onClick={() =>
            handleNavigation(
              "/viewer?pdfUrl=/api/armadosMangify.pdf&configUrl=/api/config/config.json"
              //"/viewer?pdfUrl=/armadosMangify.pdf&configUrl=/testConfig.json"
            )
          }
          className="px-6 py-3 bg-stone-50 text-black rounded-lg shadow-xl shadow-stone-50/50 hover:scale-150 hover:translate-x-10 transition cursor-pointer"
        >
          Viewer
        </button>
      </div>
    </div>
  );
}
