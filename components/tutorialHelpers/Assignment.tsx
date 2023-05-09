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

const Assignment: React.FC<InputProps> = ({ children, assignments }) => {
  const { userScript } = useContext(AppContext);
  const [resetKey, setResetKey] = useState(Math.random());
  useEffect(() => {
    setTimeout(() => setResetKey(Math.random()));
  }, [userScript]);

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
            {assignment.subParagraph && assignment.checked && (
              <p className="mt-1 mb-2 ml-2">{assignment.subParagraph}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Assignment;