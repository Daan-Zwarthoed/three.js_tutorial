import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
type InputProps = {
  children?: any;
};

const CodeText: React.FC<InputProps> = ({ children }) => {
  return (
    <div
      id="ResizableCodeNeighbour"
      className=" w-full h-full overflow-auto p-5 pb-10"
    >
      {children}
    </div>
  );
};

export default CodeText;
