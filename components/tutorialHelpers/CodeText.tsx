import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import NextStepButton from "../global/StepButton";
type InputProps = {
  children?: React.ReactNode;
};

const CodeText: React.FC<InputProps> = ({ children }) => {
  return (
    <div className="w-full h-full overflow-auto px-5 pb-5">
      <h3 className="w-full bg-background top-0 z-30 mb-5 text-quartery hover:text-white">
        Explanation
      </h3>

      {children}
    </div>
  );
};

export default CodeText;
