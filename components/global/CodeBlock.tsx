import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";

// import ace from "ace-builds";
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });
type Props = {
  pageFunction?: Function;
  showBefore?: any;
  inputValue?: string;
  showAfter?: any;
  inputHeight?: number;
  children?: any;
};
const CodeBlock: React.FC<Props> = ({
  showBefore,
  showAfter,
  inputValue,
  inputHeight,
}) => {
  const { setUserScript } = useContext(AppContext);
  const beforeHeight = showBefore.split(/\r\n|\r|\n/).length;
  if (!inputHeight && !inputValue)
    return <>Input value or height needs to be defined</>;

  inputHeight = inputHeight || inputValue!.split(/\r\n|\r|\n/).length;

  return (
    <div className="relative h-full w-full">
      <CodeEditor
        inputHeight={beforeHeight + inputHeight}
        beforeHeight={beforeHeight}
      >
        {showBefore +
          (inputValue
            ? inputValue
            : [...Array(inputHeight + 1)].map(() => "\n").join("")) +
          showAfter}
      </CodeEditor>
      {/* <ConsoleLog /> */}
    </div>
  );
};

export default CodeBlock;

// style={{
//   width: `${inputHeight ? 50 : 5}ch`,
//   minWidth: `${inputHeight ? 50 : 5}ch`,
// }}
// {(hintBefore || "") + "EDITAREA" + (hintAfter || "")}
