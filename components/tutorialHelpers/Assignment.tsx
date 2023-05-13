import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import NextStepButton from "../global/StepButton";
import AppContext from "../../contexts/AppContextProvider";

type Assignment = {
  title: string;
  subParagraph?: string;
  checked: boolean;
};

type InputProps = {
  children?: any;
  assignments: { [key: string]: Assignment };
};
let assignmentsClone: { [key: string]: Assignment };
const Assignment: React.FC<InputProps> = ({ children, assignments }) => {
  const { setShowRobot } = useContext(AppContext);
  useEffect(() => {
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

        if (completedAssignment) {
          console.log(
            completedAssignment === assignmentKeys[assignmentKeys.length - 1]
          );

          assignments[completedAssignment];
          setShowRobot({
            text: assignments[completedAssignment].subParagraph,
            nextButton:
              completedAssignment === assignmentKeys[assignmentKeys.length - 1],
          });
        }
      }
      assignmentsClone = JSON.parse(JSON.stringify(assignments));
    });
  });

  return (
    <div>
      {Object.keys(assignments).map((key) => {
        const assignment = assignments[key];
        return (
          <div key={key}>
            <input
              type="checkbox"
              id="scales"
              name="scales"
              className="mr-3 accent-primary"
              checked={assignment.checked}
              readOnly
            />
            <label htmlFor="scales">{assignment.title}</label>
            {/* {assignment.subParagraph && assignment.checked && (
              <p className="mt-1 mb-2 ml-2">{assignment.subParagraph}</p>
            )} */}
          </div>
        );
      })}
    </div>
  );
};

export default Assignment;
