import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

export default function Index() {
  const navigate = useNavigate();

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="absolute z-11 top-0 inset-x-0 justify-center flex items-center h-1/2">
        <h1 className="text-white text-8xl font-serif">
          Mangify
        </h1>
      </div>
      <div className="flex space-x-8 z-10">
        <Button
          onClick={() =>
            handleNavigation(
              "/editor?pdfUrl=/armadosMangify.pdf&configUrl=/testConfig.json"
            )
          }
          className="px-6 py-6 rounded text-4xl font-serif cursor-pointer blur-none"
        >
          <FontAwesomeIcon icon={faPencil} className="w-32 h-32"/>
          Editor
        </Button>
        <Button
          onClick={() =>
            handleNavigation(
              "/viewer?pdfUrl=/armadosMangify.pdf&configUrl=/testConfig.json"
            )
          }
          className="px-6 py-6 rounded text-4xl font-serif cursor-pointer"
        >
          <FontAwesomeIcon icon={faBookOpen} />
          Viewer
        </Button>
      </div>
    </div>
  );
}
