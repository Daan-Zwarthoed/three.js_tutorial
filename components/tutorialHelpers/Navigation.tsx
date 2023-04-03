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

  return (
    <div id="Navigation" className="flex flex-row justify-between px-2">
      {stepIndex !== -1 && (
        <>
          {previousStepId && (
            <div
              onClick={() => {
                Router.query.step = previousStepId;
                Router.push(Router);
              }}
            >
              Go to {previousStepId}
            </div>
          )}
          {!previousStepId && <div></div>}
          <div>{stepList[stepIndex].id}</div>
          {nextStepId && (
            <div
              onClick={() => {
                Router.query.step = nextStepId;
                Router.push(Router);
              }}
            >
              Go to {nextStepId}
            </div>
          )}
          {!nextStepId && <div></div>}
        </>
      )}
    </div>
  );
};

export default Navigation;
