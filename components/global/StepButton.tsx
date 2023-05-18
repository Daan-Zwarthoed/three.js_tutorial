import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { stepList } from "../../pages/tutorial";
import Router from "next/router";
import AppContext from "../../contexts/AppContextProvider";
type InputProps = {
  next?: true;
  classes?: string;
};

const StepButton: React.FC<InputProps> = ({ next, classes }) => {
  const { accessibleSteps, setUserScript, setShowRobot } =
    useContext(AppContext);
  const [goalStepId, setGoalStepId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const routerStepIndex = stepList.findIndex(
      (item) => item.id === Router.query.step
    );

    const goalStep = next
      ? stepList[routerStepIndex + 1]
      : stepList[routerStepIndex - 1];

    setGoalStepId(goalStep ? goalStep.id : undefined);
  });
  const changeStep = (id: string | string[] | undefined) => {
    if (typeof id !== "string" || !accessibleSteps.includes(id)) return;
    setShowRobot(null);
    setUserScript(null);
    Router.push({
      pathname: "/tutorial",
      query: { ...Router.query, step: id },
    });
  };
  // console.log(goalStepId);

  if (!goalStepId) return <></>;
  return (
    <button
      className={
        classes ||
        `px-1 rounded-md w-fit ml-4 ${
          next
            ? accessibleSteps.includes(goalStepId)
              ? "bg-primary"
              : "border-2 border-slate-700 cursor-default"
            : ""
        }`
      }
      onClick={() => changeStep(goalStepId)}
    >
      {next ? "Next" : "Back"}
    </button>
  );
};

export default StepButton;
