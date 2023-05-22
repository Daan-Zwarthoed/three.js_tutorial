import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";

// import ace from "ace-builds";
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });
type Props = {
  children?: string;
};
const CodeBlockInline: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative my-2">
      <CodeEditor inline>{`${children}`}</CodeEditor>
    </div>
  );
};

export default CodeBlockInline;
