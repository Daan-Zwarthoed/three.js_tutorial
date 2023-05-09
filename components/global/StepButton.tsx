import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { stepList } from "../../pages/tutorial";
import Router from "next/router";
import AppContext from "../../contexts/AppContextProvider";
type InputProps = {
  next?: true;
};

const StepButton: React.FC<InputProps> = ({ next }) => {
  const { setUserScript } = useContext(AppContext);
  const [goalStepId, setGoalStepId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const routerStepIndex = stepList.findIndex(
      (item) => item.id === Router.query.step
    );

    const goalStep = next
      ? stepList[routerStepIndex + 1]
      : stepList[routerStepIndex - 1];
    if (goalStep) setGoalStepId(goalStep.id);
  });
  const changeStep = (id: string | string[] | undefined) => {
    if (typeof id !== "string") return;
    setUserScript(null);
    Router.push({
      pathname: "/tutorial",
      query: { ...Router.query, step: id },
    });
  };
  if (!goalStepId) return <></>;
  return (
    <button
      className={`p-1 rounded-xl w-fit ml-4 ${next ? "bg-primary" : ""}`}
      onClick={() => changeStep(goalStepId)}
    >
      {next ? "Next" : "Back"}
    </button>
  );
};

export default StepButton;
