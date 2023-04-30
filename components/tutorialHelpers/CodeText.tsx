import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import NextStepButton from "../global/NextStepButton";
type InputProps = {
  children?: any;
};

const CodeText: React.FC<InputProps> = ({ children }) => {
  return (
    <div
      id="ResizableCodeNeighbour"
      className="w-full h-full overflow-auto px-5 pb-5"
    >
      <h2 className="w-full bg-primary top-0 z-30 mb-5">Explanation</h2>

      {children}
      <NextStepButton></NextStepButton>
    </div>
  );
};

export default CodeText;
