import React from "react";
import * as FA from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  children: React.ReactNode;
};

const Note: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-row my-3">
      <FontAwesomeIcon
        className="shrink-0 mr-2 h-5 w-5 cursor-pointer mt-1.5"
        size="sm"
        icon={FA.faWarning}
        color={"#D25E2F"}
      />
      <p className="text-[#969696]">{children}</p>
    </div>
  );
};

export default Note;
