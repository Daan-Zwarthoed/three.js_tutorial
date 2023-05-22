import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";
import ResizableHorizontal from "../global/ResizableHorizontal";
import ResizableVertical from "../global/ResizableVertical";
// import ace from "ace-builds";
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });
import { Hook, Console, Decode } from "console-feed";
import { Message } from "console-feed/lib/definitions/Component";
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
  const { setUserScript } = useContext(AppContext);
  const [logs, setLogs] = useState<Message[]>([]);

  const allImports = defaultImport + (showImports ? showImports : "");

  const beforeHeight = allImports.split(/\r\n|\r|\n/).length;
  const inputHeight = beforeHeight + code.split(/\r\n|\r|\n/).length - 1;

  useEffect(() => {
    setUserScript(code);
  }, [code]);

  useEffect(() => {
    Hook(window.console, (log) => {
      const newLog = Decode(log);
      if (newLog && newLog.data && newLog.method === "error")
        newLog.data[0] = newLog.data[0].split("\n")[0];
      setLogs([...logs, newLog as Message]);
    });
  });

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
          <Console filter={["log", "error"]} logs={logs} variant="dark" />
        </div>
      </ResizableVertical>
    </ResizableHorizontal>
  );
};

export default CodeBlock;
