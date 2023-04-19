import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import AppContext from "../contexts/AppContextProvider";
import Image from "next/image";
import ResizableCanvas from "./global/Resizable";
import Resizable from "./global/Resizable";
import Router from "next/router";
type InputProps = {
  threeScript: Function;
};
let firstLoad = true;
const Scene: React.FC<InputProps> = ({ threeScript }) => {
  const { userScript, tutorialStep } = useContext(AppContext);
  const [resetKey, setResetKey] = useState(1);
  useEffect(() => {
    threeScript(userScript);
  }, [userScript, resetKey]);

  const reset = () => {
    if (firstLoad) return (firstLoad = false);

    setResetKey(Math.random());
  };

  useEffect(() => {
    reset();
  }, [tutorialStep]);
  return (
    <Resizable resizeTarget="Canvas">
      <div
        style={{ opacity: 0, display: "none" }}
        className="absolute z-20 text-center right-0 bg-white/70 pr-5"
      >
        <div id="backButton" className="relative h-20 w-20 ml-auto my-5">
          <Image src="/images/backButton.png" fill alt="back button"></Image>
        </div>
        <div>This is my beautifaul back button it is so precious.</div>
      </div>
      <canvas
        key={resetKey}
        id="canvas"
        className="relative z-10 object-contain mx-auto w-full h-full"
      ></canvas>
    </Resizable>
  );
};

export default Scene;
