import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";
import ResizableHorizontal from "../global/ResizableHorizontal";
import ResizableVertical from "../global/ResizableVertical";
// import ace from "ace-builds";
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });
type Error = {
  message: string;
  stack: string;
};
type Props = {
  showImports?: string;
  code: string;
  children?: string;
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
  const { setUserScript, newError, setNewError } = useContext(AppContext);
  const [allErrors, setAllErrors] = useState<string[]>([]);
  const allImports = defaultImport + (showImports ? showImports : "");

  const beforeHeight = allImports.split(/\r\n|\r|\n/).length;
  const inputHeight = beforeHeight + code.split(/\r\n|\r|\n/).length - 1;

  useEffect(() => {
    setUserScript(code);
    setAllErrors([]);
  }, [code]);

  useEffect(() => {
    if (newError) {
      setAllErrors([...allErrors, newError]);
      setNewError(null);
    }
  }, [newError]);

  return (
    <ResizableHorizontal resizeTarget="Code">
      <h2 className="w-full bg-background top-0 z-30 pl-3">Input</h2>
      <CodeEditor
        inputHeight={beforeHeight + inputHeight}
        beforeHeight={beforeHeight}
        highlightArea={highlightArea}
        scrollToLine={scrollToLine}
      >
        {allImports + ("\n" + code + "\n")}
      </CodeEditor>
      <ResizableVertical resizeTarget="Console">
        <div className="w-full h-full pl-3 bg-black pb-10 pt-[10px]">
          <p className="px-4 py-1 border-b border-secondary">Console</p>
          {allErrors.map((error: string, index: number) => (
            <p
              className="px-4 py-1 border-b border-red-500 text-red-500 text-[15px] border-solid"
              key={error + index}
            >
              {error}
            </p>
          ))}
        </div>
      </ResizableVertical>
    </ResizableHorizontal>
  );
};

export default CodeBlock;
