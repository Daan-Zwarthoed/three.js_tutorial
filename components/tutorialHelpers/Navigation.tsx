import Head from "next/head";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Router from "next/router";
import gsap from "gsap";
import AppContext from "../../contexts/AppContextProvider";
import { stepList } from "../../pages/tutorial";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StepButton from "../global/StepButton";
import * as FA from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Navigation: React.FC = () => {
  const { accessibleSteps, setUserScript } = useContext(AppContext);
  const [stepIndex, setStepIndex] = useState<number>(-1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const routerStepIndex = stepList.findIndex(
      (item) => item.id === Router.query.step
    );

    if (routerStepIndex !== stepIndex) setStepIndex(routerStepIndex);
  });

  const changeStep = (id: string) => {
    if (!accessibleSteps.includes(id)) return;
    setUserScript(null);
    Router.push({
      pathname: "/tutorial",
      query: { ...Router.query, step: id },
    });
  };

  const handleHover = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
    id: string,
    enter: boolean
  ) => {
    const toolTip = document.getElementById("ToolTip");
    if (!toolTip) return;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const center = rect.left + rect.width / 2;
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
      className="relative bottom-0 h-[5%] w-full z-50 p-2 bg-background flex flex-row items-center justify-center px-2"
    >
      <div className="absolute left-5 bottom-1/2 translate-y-1/2">
        <Link href="/">
          <FontAwesomeIcon
            className="h-5 w-5"
            size="sm"
            icon={FA.faHome}
            color={"white"}
          />
        </Link>
      </div>
      <div className="flex flex-row items-center">
        {stepList.map((step, index) => (
          <FontAwesomeIcon
            onClick={() => changeStep(step.id)}
            onMouseEnter={(event) => handleHover(event, step.id, true)}
            onMouseLeave={(event) => handleHover(event, step.id, false)}
            className={`mr-2 h-5 w-5 mx-3 ${
              accessibleSteps.includes(step.id) ? "cursor-pointer" : ""
            }`}
            size="sm"
            icon={step.icon}
            color={
              accessibleSteps.includes(step.id)
                ? index === stepIndex
                  ? "#D25E2F"
                  : "white"
                : "grey"
            }
            key={step.id}
          />
        ))}
        <div
          id="ToolTip"
          className="absolute -top-full -translate-x-1/2 opacity-0 bg-background py-1 px-3 text-white"
        ></div>
      </div>
      <div className="absolute right-5 bottom-1/2 translate-y-1/2">
        <StepButton></StepButton>
        <StepButton next></StepButton>
      </div>
    </div>
  );
};

export default Navigation;
