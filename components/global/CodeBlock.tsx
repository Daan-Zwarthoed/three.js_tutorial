import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import AppContext from "../../contexts/AppContextProvider";
type Props = {
  pageFunction?: any;
  showBefore?: any;
  showAfter?: any;
  children?: any;
};
const CodeBlock: React.FC<Props> = ({ showBefore, showAfter }) => {
  const { setUserScript } = useContext(AppContext);

  let timeout: NodeJS.Timeout | null = null;
  const handleChange = (event: any) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setUserScript(event.target.value);
    }, 500);
  };
  return (
    <div>
      <pre className="flex flex-col">
        {showBefore}
        <input
          type="text"
          name="codeblock"
          id="codeblock"
          className="bg-blue-200"
          onChange={(event) => handleChange(event)}
        />
        {showAfter}
      </pre>
    </div>
  );
};

export default CodeBlock;
