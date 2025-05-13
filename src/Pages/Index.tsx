import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex space-x-4">
        <button
          onClick={() =>
            handleNavigation(
              "/editor?pdfUrl=/armadosMangify.pdf&configUrl=/testConfig.json"
            )
          }
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer"
        >
          Editor
        </button>
        <button
          onClick={() =>
            handleNavigation(
              "/viewer?pdfUrl=/armadosMangify.pdf&configUrl=/testConfig.json"
            )
          }
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition cursor-pointer"
        >
          Viewer
        </button>
      </div>
    </div>
  );
}
