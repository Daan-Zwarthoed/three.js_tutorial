import React from "react";
const AppContext = React.createContext<any>(false);


export const AppContextProvider = ({ children }: any) => {
    const [appState, setAppState] = React.useState<boolean>(false);
    return (
        <AppContext.Provider
            value={{ appState, setAppState }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;