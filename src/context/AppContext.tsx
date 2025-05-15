import { createContext, useContext, useState } from "react"

export const AppConext = createContext<any>(null)

export const AppProvider = ({ children }: any) => {
    const [nodos, setNodos] = useState<boolean>(false)
    const [separador, setSeparador] = useState<boolean>(false)
    const [musica, setMusica] = useState<boolean>(false)
    const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [config, setConfig] = useState<any>(null);

    return (
        <AppConext.Provider value={{ nodos, setNodos, separador, setSeparador, musica, setMusica, menuAbierto, setMenuAbierto, pdfUrl, setPdfUrl, config, setConfig }}>
            {children}
        </AppConext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppConext)
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider")
    }
    return context
}