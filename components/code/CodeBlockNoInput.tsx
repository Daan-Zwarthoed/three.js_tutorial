import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";
import Resizable from "../global/Resizable";

const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });
type Props = {
  children?: any;
};
const CodeBlockNoInput: React.FC<Props> = ({ children }) => {
  return (
    <Resizable resizeTarget="Code">
      <CodeEditor>{children}</CodeEditor>
    </Resizable>
  );
};

export default CodeBlockNoInput;
