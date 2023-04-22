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
      className="w-full h-full overflow-auto p-5"
    >
      {children}
      <NextStepButton></NextStepButton>
    </div>
  );
};

export default CodeText;
