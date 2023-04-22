import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { stepList } from "../../pages/tutorial";
import Router from "next/router";
import AppContext from "../../contexts/AppContextProvider";
type InputProps = {
  children?: any;
};

const NextStepButton: React.FC<InputProps> = ({ children }) => {
  const { setUserScript } = useContext(AppContext);
  const [nextStepId, setNextStepId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const routerStepIndex = stepList.findIndex(
      (item) => item.id === Router.query.step
    );

    const nextStep = stepList[routerStepIndex + 1];
    if (nextStep) setNextStepId(nextStep.id);
  });
  const changeStep = (id: string | string[] | undefined) => {
    if (typeof id !== "string") return;
    setUserScript(null);
    Router.push({
      pathname: "/tutorial",
      query: { ...Router.query, step: id },
    });
  };
  return (
    <button
      className="p-2 mt-3 bg-accent rounded-xl w-fit"
      onClick={() => changeStep(nextStepId)}
    >
      Go to: {nextStepId}
    </button>
  );
};

export default NextStepButton;
