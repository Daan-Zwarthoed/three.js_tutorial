import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import NextStepButton from "../global/StepButton";
import * as FA from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type InputProps = {
  children?: any;
};

const Note: React.FC<InputProps> = ({ children }) => {
  return (
    <div className="flex flex-row items-center my-3">
      <FontAwesomeIcon
        className="shrink-0 mr-2 h-5 w-5 cursor-pointer"
        size="sm"
        icon={FA.faWarning}
        color={"#D25E2F"}
      />
      <p>{children}</p>
    </div>
  );
};

export default Note;
