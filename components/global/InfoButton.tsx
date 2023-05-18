import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { stepList } from "../../pages/tutorial";
import Router from "next/router";
import AppContext from "../../contexts/AppContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FA from "@fortawesome/free-solid-svg-icons";

type InputProps = {
  children: string;
};

const InfoButton: React.FC<InputProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <button
      className="relative p-2 w-10 h-10 border-2 border-slate-700 rounded-full"
      onClick={() => setOpen(!open)}
    >
      <FontAwesomeIcon
        className="h-5 w-5"
        size="sm"
        icon={FA.faInfo}
        color={"white"}
      />
      <p
        className="position absolute bottom-[125%] w-max max-w-[350px] left-1/2 -translate-x-1/2 bg-background p-2 border-2 border-slate-700 rounded-md"
        style={{ display: open ? "flex" : "none" }}
      >
        {children}
      </p>
    </button>
  );
};

export default InfoButton;
