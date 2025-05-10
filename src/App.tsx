import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Editor from './Pages/Editor.tsx'
// @ts-ignore
import Viewer from './Pages/Viewer.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Editor" element={<Editor />} />
        <Route path="/Viewer" element={<Viewer />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
