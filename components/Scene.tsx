import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import AppContext from "../contexts/AppContextProvider";
import Image from "next/image";
type InputProps = {
  threeScript: Function;
  cameraType?: THREE.PerspectiveCamera;
  animation?: any;
};
const Scene: React.FC<InputProps> = ({ threeScript }) => {
  const { uiSettings, userScript } = useContext(AppContext);
  useEffect(() => {
    threeScript(userScript);
  });

  return (
    <div
      className="relative max-h-full overflow-hidden bg-blue-500"
      style={{
        width:
          uiSettings && uiSettings.canvasWidth
            ? uiSettings.canvasWidth + "px"
            : "50%",
      }}
    >
      <div
        style={{ opacity: 0, display: "none" }}
        className="absolute z-20 text-center right-0 bg-white/70 pr-5"
      >
        <div id="backButton" className="relative h-20 w-20 ml-auto my-5">
          <Image src="/images/backButton.png" fill alt="back button"></Image>
        </div>
        <div>hallo ik ben daan</div>
      </div>
      <canvas
        id="canvas"
        style={{
          width:
            uiSettings && uiSettings.canvasWidth
              ? uiSettings.canvasWidth + "px"
              : "100%",
          height: "100%",
        }}
        className="relative z-10 object-contain mx-auto max-w-full max-h-full"
      ></canvas>
    </div>
  );
};

export default Scene;
