import React from "react";
import dynamic from "next/dynamic";
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });

type Props = {
  children: string;
};

const CodeBlockInline: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative my-2">
      <CodeEditor inline>{`${children}`}</CodeEditor>
    </div>
  );
};

export default CodeBlockInline;
