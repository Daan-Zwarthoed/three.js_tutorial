import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import Router from "next/router";

import AppContext from "../../contexts/AppContextProvider";
type InputProps = {
  children?: any;
};

const Resizable: React.FC<InputProps> = ({ children }) => {
  const { setUiSettings } = useContext(AppContext);

  let initialPos: number | null = null;
  let initialSize: number | null = null;

  const initial = (event: any) => {
    const resizable = document.getElementById("Resizable");
    if (!resizable) return;
    initialPos = event.clientY;
    initialSize = resizable.clientHeight;
  };

  const resize = (event: any) => {
    const resizable = document.getElementById("Resizable");
    const canvas = document.getElementById("canvas");

    if (!resizable || !canvas || !initialSize || !initialPos || !event.clientY)
      return;
    resizable.style.height = `${initialSize + (event.clientY - initialPos)}px`;
    canvas.style.height = `${window.innerHeight - resizable.offsetHeight}px`;
    canvas.parentElement!.style.height = `${
      window.innerHeight - resizable.offsetHeight
    }px`;
  };

  const calucluateCanvasSize = (event: any) => {
    const resizable = document.getElementById("Resizable");
    if (!resizable) return;
    initialPos = event.clientY;
    initialSize = resizable.offsetHeight;
    setUiSettings({ canvasSize: window.innerHeight - resizable.offsetHeight });
  };

  return (
    <div id="Resizable" className="flex flex-col h-1/2">
      <div
        onClick={() => {
          Router.query.step = "prerequisites";
          Router.push(Router);
        }}
      >
        go to Prerequisites
      </div>
      <div className="flex w-full h-full p-5">{children}</div>
      <div
        className="flex w-full h-[20px] cursor-row-resize bg-blue-500"
        draggable="true"
        onDragStart={(event) => initial(event)}
        onDrag={(event) => resize(event)}
        onDragEnd={(event) => calucluateCanvasSize(event)}
      ></div>
    </div>
  );
};

export default Resizable;
