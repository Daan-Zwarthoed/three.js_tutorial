import Head from "next/head";
import React, { useContext, useEffect } from "react";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";
import Resizable from "../global/Resizable";
// import ace from "ace-builds";
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });
type Props = {
  showImports?: string;
  code: string;
  children?: string;
  highlightArea?: {
    startRow: number;
    endRow: number;
  };
};

const defaultImport = `import * as THREE from "three";
`;

const CodeBlock: React.FC<Props> = ({ code, showImports, highlightArea }) => {
  const { setUserScript } = useContext(AppContext);

  const allImports = defaultImport + (showImports ? showImports : "\n");

  const beforeHeight = allImports.split(/\r\n|\r|\n/).length;
  const inputHeight = beforeHeight + code.split(/\r\n|\r|\n/).length - 1;

  useEffect(() => {
    setUserScript(code);
  }, [code]);

  return (
    <Resizable resizeTarget="Code">
      <h2 className="w-full bg-background top-0 z-30 pl-3">Input</h2>
      <CodeEditor
        inputHeight={beforeHeight + inputHeight}
        beforeHeight={beforeHeight}
        highlightArea={highlightArea}
      >
        {allImports + ("\n" + code + "\n")}
      </CodeEditor>
    </Resizable>
  );
};

export default CodeBlock;
