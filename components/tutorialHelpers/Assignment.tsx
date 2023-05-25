import React, { useContext, useEffect } from "react";
import AppContext from "../../contexts/AppContextProvider";
import * as FA from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gsap from "gsap";
import { stepList } from "../../pages/tutorial";
import Router from "next/router";
import { getStepFromCurrent } from "../../helpers/getStep";

type Assignment = {
  title: string;
  hint: string;
  subParagraph?: string;
  checked: boolean;
};

type Props = {
  assignments?: { [key: string]: Assignment };
};

let assignmentsClone: { [key: string]: Assignment };

const Assignment: React.FC<Props> = ({ assignments }) => {
  const { accessibleSteps, setAccessibleSteps, setShowRobot } =
    useContext(AppContext);

  let nextStepId: string;

  useEffect(() => {
    // Get step
    const nextStep = getStepFromCurrent(1);
    if (nextStep) nextStepId = nextStep.id;

    //  Check assignments
    if (assignments) {
      setTimeout(() => {
        const assignmentKeys = Object.keys(assignments);
        // Check if assignemnt en assignmentsclone are the same assignments
        if (
          assignmentsClone &&
          assignmentKeys.every(
            (val, index) => val === Object.keys(assignmentsClone)[index]
          )
        ) {
          // Find completed assignment
          const completedAssignment = assignmentKeys.find(
            (key) =>
              assignmentsClone[key].checked !== assignments[key].checked &&
              assignments[key].checked
          );

          // See if completed assignment is also the final one
          const completedFinalAssignment =
            assignments[assignmentKeys[assignmentKeys.length - 1]] &&
            assignments[assignmentKeys[assignmentKeys.length - 1]].checked;

          if (completedAssignment) {
            // Show the robot if you completed an assignment
            setShowRobot({
              text: assignments[completedAssignment].subParagraph,
              nextButton: completedFinalAssignment,
            });

            // If you completed all assignments the next step will be unlocked
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
    }
  });

  // Open or close hint
  const handleHintClick = (event: React.MouseEvent<HTMLElement>) => {
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
      duration: 0.5,
    });
  };
  return (
    <div className="-mx-5 mt-10">
      <h2 className="w-full pb-1 pt-2 px-5">Assignments</h2>
      <div>
        {assignments &&
          Object.keys(assignments).map((key, index) => {
            const assignment = assignments[key];
            return (
              <div key={key} className="mb-5">
                <div className="flex flex-row items-center px-5">
                  {/* Checkbox */}
                  <div
                    className={`shrink-0 border-2 border-solid border-primary h-4 w-4 mr-3 flex justify-center items-center rounded-sm ${
                      assignment.checked ? "bg-primary" : ""
                    }`}
                  >
                    <FontAwesomeIcon
                      className="w-3/4 h-3/4"
                      style={{ display: assignment.checked ? "flex" : "none" }}
                      size="sm"
                      icon={FA.faCheck}
                      color={"white"}
                    />
                  </div>
                  {/* Checkbox title */}
                  <p>
                    <strong>{index + 1}.</strong> {assignment.title}
                  </p>
                </div>
                {/* Hint button */}
                <button
                  className="w-full text-start my-3 bg-quartery px-5 flex flex-row items-center"
                  onClick={handleHintClick}
                >
                  <p className="pointer-events-none">
                    Need some help? Get a hint.
                  </p>
                  <FontAwesomeIcon
                    className="w-4 h-4 ml-auto pointer-events-none"
                    style={{ transform: "rotate(0deg)" }}
                    size="sm"
                    icon={FA.faChevronDown}
                    color={"white"}
                  />
                </button>
                {/* Hint itself */}
                <p className=" pr-5 pl-7" style={{ display: "none" }}>
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
