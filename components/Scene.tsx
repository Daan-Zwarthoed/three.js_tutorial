import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import AppContext from "../contexts/AppContextProvider";
type InputProps = {
  threeScript: Function;
  cameraType?: THREE.PerspectiveCamera;
  animation?: any;
};

const Scene: React.FC<InputProps> = ({ threeScript }) => {
  const { uiSettings, userScript } = useContext(AppContext);
  useEffect(() => {
    threeScript();
  }, []);

  return (
    <div
      className="bg-black max-h-full overflow-hidden"
      style={{
        height:
          uiSettings && uiSettings.canvasSize
            ? uiSettings.canvasSize + "px"
            : "50%",
      }}
    >
      <canvas
        id="canvas"
        style={{
          height:
            uiSettings && uiSettings.canvasSize
              ? uiSettings.canvasSize + "px"
              : "100%",
        }}
        className="object-contain mx-auto max-w-full max-h-full"
      ></canvas>
    </div>
  );
};

export default Scene;
