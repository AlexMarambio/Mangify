import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './context/AppContext.tsx'
import { PageProvider } from './context/PageContext.tsx'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <PageProvider>
        <App />
      </PageProvider>
    </AppProvider>
  </StrictMode>,
)
