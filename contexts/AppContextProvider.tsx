import React, { useEffect } from "react";
import { stepList } from "../pages/tutorial";
const AppContext = React.createContext<any>(null);
let initialLoad = true;
export const AppContextProvider = ({ children }: any) => {
  const [userScript, setUserScript] = React.useState<string | null>(null);
  const [tutorialStep, setTutorialStep] = React.useState<number>(-1);
  const [resetCanvasKey, setResetCanvasKey] = React.useState<number>(
    Math.random()
  );
  const [showRobot, setShowRobot] = React.useState<{
    text?: string;
    nextButton?: boolean;
  } | null>(null);
  const [accessibleSteps, setAccessibleSteps] = React.useState<string[]>([]);

  const getAccessibleSteps = () => {
    const stringifydAccessibleSteps =
      window.localStorage.getItem("Accessible_Steps");
    if (!stringifydAccessibleSteps) return;
    const parsedAccessibleSteps = JSON.parse(stringifydAccessibleSteps);
    setAccessibleSteps(parsedAccessibleSteps);
  };

  useEffect(() => {
    getAccessibleSteps();
  }, []);

  const saveAccessibleSteps = () => {
    if (initialLoad) return (initialLoad = false);
    window.localStorage.setItem(
      "Accessible_Steps",
      JSON.stringify(accessibleSteps)
    );
  };

  useEffect(() => {
    saveAccessibleSteps();
  }, [accessibleSteps]);

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
        accessibleSteps,
        setAccessibleSteps,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
