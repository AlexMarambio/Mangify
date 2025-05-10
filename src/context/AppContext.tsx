import { createContext, useContext, useState } from "react"

export const AppConext = createContext<any>(null)
export const AppProvider = ({ children }: any) => {
    const [nodos, setNodos] = useState(false)
    const [separador, setSeparador] = useState(false)
    const [musica, setMusica] = useState(false)

    return (
        <AppConext.Provider value={{ nodos, setNodos, separador, setSeparador, musica, setMusica }}>
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