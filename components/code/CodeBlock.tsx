import Head from "next/head";
import React, { useContext, useEffect } from "react";
import AppContext from "../../contexts/AppContextProvider";
import dynamic from "next/dynamic";
import Resizable from "../global/Resizable";

// import ace from "ace-builds";
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });
type Props = {
  showBefore?: any;
  inputValue?: string;
  showAfter?: any;
  inputHeight?: number;
  noInput?: boolean;
  children?: any;
  highlightArea?: {
    startRow: number;
    endRow: number;
  };
};
const CodeBlock: React.FC<Props> = ({
  showBefore,
  showAfter,
  inputValue,
  inputHeight,
  noInput,
  highlightArea,
}) => {
  const { userScript } = useContext(AppContext);
  const beforeHeight = showBefore.split(/\r\n|\r|\n/).length;
  if (!inputHeight && !inputValue)
    return (
      <>Input value or height needs to be defined or noInput needs to be true</>
    );
  if (userScript && !inputValue) inputValue = userScript;
  inputHeight = inputHeight || inputValue!.split(/\r\n|\r|\n/).length;

  return (
    <Resizable resizeTarget="Code">
      <CodeEditor
        inputHeight={beforeHeight + inputHeight}
        beforeHeight={beforeHeight}
        highlightArea={highlightArea}
      >
        {showBefore +
          (inputValue
            ? "\n" + inputValue + "\n"
            : [...Array(inputHeight + 1)].map(() => "\n").join("")) +
          showAfter}
      </CodeEditor>
    </Resizable>
  );
};

export default CodeBlock;
