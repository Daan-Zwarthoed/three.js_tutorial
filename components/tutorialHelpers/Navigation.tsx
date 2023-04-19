import Head from "next/head";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Router from "next/router";
import gsap from "gsap";
import AppContext from "../../contexts/AppContextProvider";
import { stepList } from "../../pages/tutorial";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
type InputProps = {
  children?: any;
};

const Navigation: React.FC<InputProps> = ({ children }) => {
  const { userScript, setUserScript } = useContext(AppContext);
  const [stepIndex, setStepIndex] = useState<number>(-1);
  let toolTip = useRef(<div></div>);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const routerStepIndex = stepList.findIndex(
      (item) => item.id === Router.query.step
    );

    if (routerStepIndex !== stepIndex) setStepIndex(routerStepIndex);
  });

  const changeStep = (id: string) => {
    setUserScript(null);
    Router.push({
      pathname: "/tutorial",
      query: { ...Router.query, step: id },
    });
  };

  const handleHover = (event: any, id: string, enter: boolean) => {
    const toolTip = document.getElementById("ToolTip");
    if (!toolTip) return;
    const rect = event.target.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    console.log(center);
    toolTip.style.left = center + "px";
    toolTip.innerHTML = id;
    // toolTip.left = center;
    gsap.to(toolTip!.style, {
      opacity: enter ? 1 : 0,
      duration: 0.5,
      ease: "power1.out",
    });
  };

  return (
    <div
      id="Navigation"
      className="relative bottom-0 w-full z-40 p-2 bg-primary flex flex-row justify-center  px-2"
    >
      {stepList.map((step, index) => (
        <FontAwesomeIcon
          onClick={() => changeStep(step.id)}
          onMouseEnter={(event) => handleHover(event, step.id, true)}
          onMouseLeave={(event) => handleHover(event, step.id, false)}
          className="mr-2 h-5 w-5 cursor-pointer mx-3"
          size="sm"
          icon={step.icon}
          color={index === stepIndex ? "#D25E2F" : "white"}
        />
      ))}
      <div
        id="ToolTip"
        className="absolute -top-full -translate-x-1/2 opacity-0 bg-primary py-1 px-3 text-white"
      ></div>
    </div>
  );
};

export default Navigation;
// bg-quartery
