import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";

// import ace from "ace-builds";
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });
type Props = {
  children?: any;
};
const CodeBlockNoInput: React.FC<Props> = ({ children }) => {
  const { setUserScript } = useContext(AppContext);

  return (
    <div className="relative h-full w-full">
      <CodeEditor>{children}</CodeEditor>
      {/* <ConsoleLog /> */}
    </div>
  );
};

export default CodeBlockNoInput;
