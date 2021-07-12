import { useState, createContext } from "react";

export const GraphContext = createContext()

export function GraphProvider({ children }) {

    const [graphSettings, setGraphSettings] = useState({nodes: [], edges: []})
    const [dependencies, setDependencies] = useState({})

    return (
        <GraphContext.Provider value={{
            dependencies,
            setDependencies,
            graphSettings,
            setGraphSettings,
        }}>
            {children}
        </GraphContext.Provider>
    )
}