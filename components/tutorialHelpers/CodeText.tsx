import React from "react";

type Props = {
  children?: React.ReactNode;
};

const CodeText: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-full h-full overflow-auto px-5 pb-5">
      <h3 className="w-full bg-background top-0 z-30 mb-5 text-canvasBackground hover:text-white">
        Explanation
      </h3>

      {children}
    </div>
  );
};

export default CodeText;
