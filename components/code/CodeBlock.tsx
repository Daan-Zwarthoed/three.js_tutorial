import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";
import ResizableHorizontal from "../global/ResizableHorizontal";
import ResizableVertical from "../global/ResizableVertical";
import MyConsole from "./MyConsole";
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });

type Props = {
  showImports?: string;
  code: string;
  highlightArea?: {
    startRow: number;
    endRow: number;
  };
  scrollToLine?: number;
};

const defaultImport = `import * as THREE from "three";
`;

const CodeBlock: React.FC<Props> = ({
  code,
  showImports,
  highlightArea,
  scrollToLine,
}) => {
  const { setUserScript } = useContext(AppContext);

  const allImports = defaultImport + (showImports ? showImports : "");

  const beforeHeight = allImports.split(/\r\n|\r|\n/).length;
  const inputHeight = beforeHeight + code.split(/\r\n|\r|\n/).length - 1;

  useEffect(() => {
    setUserScript(code);
  }, [code]);

  return (
    <ResizableHorizontal resizeTarget="Code">
      <h3 className="w-full bg-background top-0 z-30 pl-3 text-deepBlue hover:text-white">
        Input
      </h3>
      <CodeEditor
        inputHeight={beforeHeight + inputHeight}
        beforeHeight={beforeHeight}
        highlightArea={highlightArea}
        scrollToLine={scrollToLine}
      >
        {allImports + ("\n" + code + "\n")}
      </CodeEditor>
      <ResizableVertical resizeTarget="Console">
        <MyConsole></MyConsole>
      </ResizableVertical>
    </ResizableHorizontal>
  );
};

export default CodeBlock;
