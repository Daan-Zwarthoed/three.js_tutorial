import React from "react";
import { AccesibleStepsContext } from "./AccesibleStepsContext";
import { ShowRobotContext } from "./ShowRobotContext";
import { FireConfettiPositionContext } from "./FireConfettiPositionContext";

const AppContext = React.createContext<any>(null);

type Props = {
  children?: React.ReactNode;
};
export const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [userScript, setUserScript] = React.useState<string | null>(null);
  const [resetCanvasKey, setResetCanvasKey] = React.useState<number>(
    Math.random()
  );
  const { accessibleSteps, setAccessibleSteps } = AccesibleStepsContext();
  const { showRobot, setShowRobot } = ShowRobotContext();
  const { fireConfettiPosition, setFireConfettiPosition } =
    FireConfettiPositionContext();

  return (
    <AppContext.Provider
      value={{
        userScript,
        setUserScript,
        resetCanvasKey,
        setResetCanvasKey,
        showRobot,
        setShowRobot,
        accessibleSteps,
        setAccessibleSteps,
        fireConfettiPosition,
        setFireConfettiPosition,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
