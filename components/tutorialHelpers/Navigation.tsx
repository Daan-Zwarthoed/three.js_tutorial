import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import Router from "next/router";

import AppContext from "../../contexts/AppContextProvider";
import { stepList } from "../../pages/tutorial";
type InputProps = {
  children?: any;
};

const Navigation: React.FC<InputProps> = ({ children }) => {
  const { userScript, setUserScript } = useContext(AppContext);
  const [stepIndex, setStepIndex] = useState<number>(-1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const routerStepIndex = stepList.findIndex(
      (item) => item.id === Router.query.step
    );

    if (routerStepIndex !== stepIndex) setStepIndex(routerStepIndex);
  });

  const previousStepId =
    (stepList[stepIndex - 1] && stepList[stepIndex - 1].id) || null;
  const nextStepId =
    (stepList[stepIndex + 1] && stepList[stepIndex + 1].id) || null;

  const changeStep = (next: boolean) => {
    setUserScript(null);
    Router.push({
      pathname: "/tutorial",
      query: { ...Router.query, step: next ? nextStepId : previousStepId },
    });
  };

  return (
    <div
      id="Navigation"
      className="absolute bottom-0 w-full z-40 p-2 bg-primary flex flex-row justify-between px-2"
    >
      {stepIndex !== -1 && (
        <>
          {previousStepId && (
            <div onClick={() => changeStep(false)}>Go to {previousStepId}</div>
          )}
          {!previousStepId && <div></div>}
          <div onClick={() => setUserScript(null)}>
            {stepList[stepIndex].id}
          </div>
          {nextStepId && (
            <div onClick={() => changeStep(true)}>Go to {nextStepId}</div>
          )}
          {!nextStepId && <div></div>}
        </>
      )}
    </div>
  );
};

export default Navigation;
