import React from "react";
const AppContext = React.createContext<any>(null);

type UiSettings = {
  landscape: boolean;
  canvasSize: number;
};
export const AppContextProvider = ({ children }: any) => {
  const [userScript, setUserScript] = React.useState<string | null>(null);
  const [uiSettings, setUiSettings] = React.useState<UiSettings | null>(null);

  return (
    <AppContext.Provider
      value={{
        userScript,
        setUserScript,
        uiSettings,
        setUiSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
