import React from "react";
const AppContext = React.createContext<any>(null);
// type step =
//   | "prerequisites"
//   | "renderer"
//   | "box"
//   | "addons"
//   | "light"
//   | "loader"
//   | "raycaster"
//   | "cameraAnimation"
//   | "cameraAnimationOld"
//   | "infoBubble";
export const AppContextProvider = ({ children }: any) => {
  const [userScript, setUserScript] = React.useState<string | null>(null);
  const [tutorialStep, setTutorialStep] = React.useState<number>(-1);

  return (
    <AppContext.Provider
      value={{
        userScript,
        setUserScript,
        tutorialStep,
        setTutorialStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
