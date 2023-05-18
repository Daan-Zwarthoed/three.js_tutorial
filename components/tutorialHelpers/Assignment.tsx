import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import NextStepButton from "../global/StepButton";
import AppContext from "../../contexts/AppContextProvider";
import * as FA from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gsap from "gsap";
import { stepList } from "../../pages/tutorial";
import Router from "next/router";

type Assignment = {
  title: string;
  hint: string;
  subParagraph?: string;
  checked: boolean;
};

type InputProps = {
  children?: any;
  assignments: { [key: string]: Assignment };
};
let assignmentsClone: { [key: string]: Assignment };
const Assignment: React.FC<InputProps> = ({ children, assignments }) => {
  const { accessibleSteps, setAccessibleSteps, setShowRobot } =
    useContext(AppContext);

  let nextStepId: string;
  useEffect(() => {
    const routerStepIndex = stepList.findIndex(
      (item) => item.id === Router.query.step
    );

    if (stepList[routerStepIndex + 1])
      nextStepId = stepList[routerStepIndex + 1].id;
    setTimeout(() => {
      const assignmentKeys = Object.keys(assignments);
      if (
        assignmentsClone &&
        assignmentKeys.every(
          (val, index) => val === Object.keys(assignmentsClone)[index]
        )
      ) {
        const completedAssignment = assignmentKeys.find(
          (key) =>
            assignmentsClone[key].checked !== assignments[key].checked &&
            assignments[key].checked
        );

        const completedFinalAssignment =
          assignments[assignmentKeys[assignmentKeys.length - 1]] &&
          assignments[assignmentKeys[assignmentKeys.length - 1]].checked;

        if (completedAssignment) {
          setShowRobot({
            text: assignments[completedAssignment].subParagraph,
            nextButton: completedFinalAssignment,
          });

          if (
            nextStepId &&
            !accessibleSteps.includes(nextStepId) &&
            completedFinalAssignment
          )
            setAccessibleSteps([...accessibleSteps, nextStepId]);
        }
      }
      assignmentsClone = JSON.parse(JSON.stringify(assignments));
    });
  });

  const handleHintClick = (event: any) => {
    const styleSibling = (
      (event.target as HTMLButtonElement)
        .nextElementSibling as HTMLParagraphElement
    ).style;
    const styleChevron = (
      (event.target as HTMLButtonElement).children[1] as HTMLElement
    ).style;
    gsap.set(styleSibling, {
      display: styleSibling.display === "none" ? "flex" : "none",
    });
    gsap.to(styleChevron, {
      transform:
        styleChevron.transform === "rotate(0deg)"
          ? "rotate(180deg)"
          : "rotate(0deg)",
      ease: "power.1",
    });
  };
  return (
    <div className="-mx-5">
      <h2 className="w-full p-2 mb-4 px-5">Assignments</h2>
      <div className="">
        {Object.keys(assignments).map((key, index) => {
          const assignment = assignments[key];
          return (
            <div key={key} className="mb-5">
              <div className="flex flex-row items-center px-5">
                <input
                  type="checkbox"
                  id="assignment"
                  name="assignment"
                  className="peer hidden"
                  checked={assignment.checked}
                  readOnly
                />
                <div className="shrink-0 bg-secondary peer-checked:bg-primary h-4 w-4 mr-3 flex justify-center items-center rounded-sm">
                  <FontAwesomeIcon
                    className="w-3/4 h-3/4"
                    style={{ display: assignment.checked ? "flex" : "none" }}
                    size="sm"
                    icon={FA.faCheck}
                    color={"white"}
                  />
                </div>
                <label htmlFor="assignment">
                  <strong className="">{index}.</strong> {assignment.title}
                </label>
              </div>
              <button
                className="w-full text-start my-3 bg-tertary px-5 flex flex-row items-center"
                onClick={handleHintClick}
              >
                <p>Need some help? Get a hint.</p>
                <FontAwesomeIcon
                  className="w-4 h-4 ml-auto"
                  style={{ transform: "rotate(0deg)" }}
                  size="sm"
                  icon={FA.faChevronDown}
                  color={"white"}
                />
              </button>
              <p
                className="peer-checked:bg-primary pr-5 pl-7"
                style={{ display: "none" }}
              >
                {assignment.hint}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assignment;
