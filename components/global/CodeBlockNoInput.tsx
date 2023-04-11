import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";

const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });
type Props = {
  children?: any;
};
const CodeBlockNoInput: React.FC<Props> = ({ children }) => {
  return (
    <div
      className="relative"
      style={{
        height: children && children.split(/\r\n|\r|\n/).length * 25 + "px",
      }}
    >
      <CodeEditor>{children}</CodeEditor>
    </div>
  );
};

export default CodeBlockNoInput;
