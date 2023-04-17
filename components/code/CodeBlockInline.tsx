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
const CodeBlockInline: React.FC<Props> = ({ children }) => {
  return (
    <div
      className="relative my-2"
      style={{
        height: children && children.split(/\r\n|\r|\n/).length * 20.5 + "px",
      }}
    >
      <CodeEditor inline>{children}</CodeEditor>
    </div>
  );
};

export default CodeBlockInline;
