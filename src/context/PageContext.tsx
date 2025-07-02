import { createContext, useContext, useState } from "react"

export const PageContext = createContext<any>(null)

export const PageProvider = ({ children }: any) => {
    const [numPages, setNumPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)

    return (
        <PageContext.Provider value={{ numPages, setNumPages, currentPage, setCurrentPage }}>
            {children}
        </PageContext.Provider>
    )
}

export const usePageContext = () => {
    const context = useContext(PageContext)
    if (!context) {
        throw new Error("usePageContext must be used within a PageProvider")
    }
    return context
}