import { Routes, Route, BrowserRouter } from "react-router-dom";
import Editor from "./Pages/Editor.tsx";
import Viewer from "./Pages/Viewer.tsx";
import Index from "./Pages/Index.tsx";
import ComicEditor from "./Pages/Lineatiempo.tsx";
import { ComicProvider } from "./components/Timeline/ComicContext.tsx";

function App() {
  return (
    <BrowserRouter>
      <ComicProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Editor" element={<Editor />} />
          <Route path="/Viewer" element={<Viewer />} />
          <Route path="/Lineatiempo" element={<ComicEditor />} />
        </Routes>
      </ComicProvider>
    </BrowserRouter>
  );
}

export default App;
