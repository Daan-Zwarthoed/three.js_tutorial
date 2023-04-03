import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import Router from "next/router";

import AppContext from "../../contexts/AppContextProvider";
import Navigation from "./Navigation";
type InputProps = {
  children?: any;
};

const Resizable: React.FC<InputProps> = ({ children }) => {
  const { setUiSettings } = useContext(AppContext);

  let initialPos: number | null = null;
  let initialSize: number | null = null;
  let mouseDown = false;

  const initial = (event: any) => {
    const resizable = document.getElementById("Resizable");
    if (!resizable) return;
    mouseDown = true;
    initialPos = event.clientX;
    initialSize = resizable.clientWidth;
  };

  const resize = (event: any) => {
    const resizable = document.getElementById("Resizable");
    const canvas = document.getElementById("canvas");

    if (
      !mouseDown ||
      !resizable ||
      !canvas ||
      !initialSize ||
      !initialPos ||
      !event.clientY
    )
      return;

    const resizableNewSize = initialSize + (event.clientX - initialPos);
    resizable.style.width = `${resizableNewSize}px`;
    canvas.style.width = `${window.innerWidth - resizableNewSize}px`;
    canvas.parentElement!.style.width = `${
      window.innerWidth - resizableNewSize
    }px`;

    window.dispatchEvent(new Event("resize"));
  };

  const calucluateCanvasSize = (event: any) => {
    const resizable = document.getElementById("Resizable");
    if (!resizable) return;
    mouseDown = false;
    initialPos = event.clientX;
    initialSize = resizable.offsetWidth;
    setUiSettings({ canvasWidth: window.innerWidth - resizable.offsetWidth });
  };
  useEffect(() => {
    window.onmousemove = (event) => mouseDown && resize(event);
    window.onmouseup = (event) => mouseDown && calucluateCanvasSize(event);
    window.onmouseleave = (event) => mouseDown && calucluateCanvasSize(event);
  });

  return (
    <div
      id="Resizable"
      className="relative flex flex-col h-full w-full pr-[20px]"
    >
      <Navigation></Navigation>
      <div className="flex w-full h-full overflow-y-auto">{children}</div>
      <div
        className="absolute right-0 z-20 flex h-full w-[20px] cursor-col-resize bg-blue-500"
        onMouseDown={(event) => initial(event)}
      ></div>
    </div>
  );
};

export default Resizable;
