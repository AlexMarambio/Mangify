import { Routes, Route, BrowserRouter } from "react-router-dom";
import Editor from "./Pages/Editor.tsx";
import Viewer from "./Pages/Viewer.tsx";
import Index from "./Pages/Index.tsx";
import LineaTiempo from "./Pages/TimeLine.tsx"
import ComicEditor from "./Pages/Lineatiempo.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Editor" element={<Editor />} />
        <Route path="/Viewer" element={<Viewer />} />
        <Route path="/Timeline" element={<LineaTiempo />} />
        <Route path="/Lineatiempo" element={<ComicEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
