import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/AppContextProvider";
import Image from "next/image";
import ResizableHorizontal from "../global/ResizableHorizontal";
import Router from "next/router";
import { getStepCurrent } from "../../helpers/getStep";

type Props = {
  threeScript: Function;
};

let firstLoad = true;

const Scene: React.FC<Props> = ({ threeScript }) => {
  const { userScript, resetCanvasKey } = useContext(AppContext);
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
  }, [Router.query.step, resetCanvasKey]);

  return (
    <ResizableHorizontal resizeTarget="Canvas">
      <h3 className="w-full bg-background top-0 z-30 pl-3 text-quartery hover:text-white">
        Result
      </h3>
      <div className="flex flex-col h-full bg-[#1e3d59]">
        {getStepCurrent().id === "Info bubble" && (
          <div
            style={{ opacity: 0, display: "none" }}
            className="absolute z-20 text-center right-0 bg-white/70 px-5"
          >
            <div
              id="backButton"
              className="relative h-20 w-20 ml-auto my-5 shrink-0 cursor-pointer"
            >
              <Image
                src="/images/backButton.png"
                sizes="10vw"
                fill
                alt="back button"
              ></Image>
            </div>
            <div>
              Here is where you could write your own text about the tire.{" "}
            </div>
          </div>
        )}
        <canvas
          key={resetKey}
          id="canvas"
          className="relative z-10 object-contain mx-auto w-full h-full"
        ></canvas>
      </div>
    </ResizableHorizontal>
  );
};

export default Scene;
