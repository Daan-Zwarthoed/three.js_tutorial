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
    threeScript(userScript);
  }, [userScript]);

  return (
    <div
      className="relative max-h-full overflow-hidden bg-blue-500"
      style={{
        height:
          uiSettings && uiSettings.canvasSize
            ? uiSettings.canvasSize + "px"
            : "50%",
      }}
    >
      <div className="absolute h-full w-full text-center text-[200px]">
        YOU A BITCH
      </div>
      <canvas
        id="canvas"
        style={{
          height:
            uiSettings && uiSettings.canvasSize
              ? uiSettings.canvasSize + "px"
              : "100%",
          width: "100%",
        }}
        className="relative z-10 object-contain mx-auto max-w-full max-h-full"
      ></canvas>
    </div>
  );
};

export default Scene;
