import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";
import Resizable from "../global/Resizable";

const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });
type Props = {
  children?: any;
  highlightArea?: {
    startRow: number;
    endRow: number;
  };
};
const CodeBlockNoInput: React.FC<Props> = ({ children, highlightArea }) => {
  return (
    <Resizable resizeTarget="Code">
      <CodeEditor highlightArea={highlightArea}>{children}</CodeEditor>
    </Resizable>
  );
};

export default CodeBlockNoInput;
