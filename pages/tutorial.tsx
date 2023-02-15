import Head from "next/head";
import * as THREE from "three";
import Router from "next/router";
const scene = new THREE.Scene();
import React, { useContext, useEffect, useState } from "react";
import Scene from "../components/Scene";
import Resizable from "../components/tutorialHelpers/Resizable";
import Prerequisites, {
  pageFunction,
} from "../components/tutorialSteps/Prerequisites";
import AppContext from "../contexts/AppContextProvider";

const Tutorial = () => {
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const stepList = [
    {
      id: "Prerequisites",
      element: <Prerequisites></Prerequisites>,
      threeScript: pageFunction,
    },
  ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const routerStepIndex = stepList.findIndex(
      (item) => item.id === Router.query.step
    );

    if (routerStepIndex !== stepIndex) setStepIndex(routerStepIndex);
  });
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen max-h-screen">
        <Resizable>
          {stepList[stepIndex] && stepList[stepIndex].element}
          {!stepList[stepIndex] && "Step does not exist"}
        </Resizable>
        <Scene threeScript={pageFunction}></Scene>
      </div>
    </>
  );
};

export default Tutorial;
