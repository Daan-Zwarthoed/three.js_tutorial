import React from "react";
const AppContext = React.createContext<any>(null);

export const AppContextProvider = ({ children }: any) => {
  const [userScript, setUserScript] = React.useState<string | null>(null);
  const [tutorialStep, setTutorialStep] = React.useState<number>(-1);
  const [resetCanvasKey, setResetCanvasKey] = React.useState<number>(
    Math.random()
  );
  const [showRobot, setShowRobot] = React.useState<boolean | string>(false);

  return (
    <AppContext.Provider
      value={{
        userScript,
        setUserScript,
        tutorialStep,
        setTutorialStep,
        resetCanvasKey,
        setResetCanvasKey,
        showRobot,
        setShowRobot,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
