import React, { useContext, useEffect, useState } from "react";
import Router from "next/router";
import AppContext from "../../contexts/AppContextProvider";
import { getStepFromCurrent } from "../../helpers/getStep";

type Props = {
  next?: true;
  classes?: string;
};

const StepButton: React.FC<Props> = ({ next, classes }) => {
  const { accessibleSteps, setUserScript } = useContext(AppContext);
  const [goalStepId, setGoalStepId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const goalStep = getStepFromCurrent(next ? 1 : -1);

    setGoalStepId(goalStep && goalStep.id);
  });

  const changeStep = (id: string | string[] | undefined) => {
    if (typeof id !== "string" || !accessibleSteps.includes(id)) return;
    setUserScript(null);
    Router.push({
      pathname: "/tutorial",
      query: { ...Router.query, step: id },
    });
  };

  if (!goalStepId) return <></>;
  return (
    <button
      className={
        classes ||
        `px-1 py-0.5 rounded-md w-fit ml-4 border-2 ${
          accessibleSteps.includes(goalStepId)
            ? "border-accent"
            : "border-inactive bg-inactive text-background font-medium cursor-default"
        }`
      }
      onClick={() => changeStep(goalStepId)}
    >
      {next ? "Next" : "Back"}
    </button>
  );
};

export default StepButton;
