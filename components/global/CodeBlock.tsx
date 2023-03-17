import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import AppContext from "../../contexts/AppContextProvider";
type Props = {
  pageFunction?: Function;
  showBefore?: any;
  hintBefore?: string;
  hintAfter?: string;
  showAfter?: any;
  inputHeight?: number;
  children?: any;
};
const CodeBlock: React.FC<Props> = ({
  showBefore,
  showAfter,
  hintBefore,
  hintAfter,
  inputHeight,
}) => {
  const { setUserScript } = useContext(AppContext);

  let timeout: NodeJS.Timeout | null = null;
  const handleChange = (event: any) => {
    event.target.style.width = +event.target.value.length + 0.5 + "ch";

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setUserScript(event.target.value);
    }, 500);
  };
  return (
    <div>
      <pre className="flex flex-col">
        {showBefore}
        <div className="flex flex-row">
          {hintBefore}
          <textarea
            name="codeblock"
            id="codeblock"
            rows={inputHeight || 1}
            style={{
              width: `${inputHeight ? 50 : 5}ch`,
              minWidth: `${inputHeight ? 50 : 5}ch`,
            }}
            className="bg-blue-200 resize-none p-0.5 overflow-hidden"
            onChange={(event) => handleChange(event)}
          />
          {hintAfter}
        </div>

        {showAfter}
      </pre>
    </div>
  );
};

export default CodeBlock;
