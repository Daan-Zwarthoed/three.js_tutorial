import React, { useEffect } from "react";
import * as FA from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStepCurrent } from "../../helpers/getStep";

type Props = {
  children: React.ReactNode;
};

const StepTitle: React.FC<Props> = ({ children }) => {
  const [stepIcon, setStepIcon] = React.useState<FA.IconDefinition | null>(
    null
  );

  useEffect(() => {
    const routerStep = getStepCurrent();
    if (routerStep) setStepIcon(routerStep.icon);
  }, [Router.query.step]);

  return (
    <div className="border-b-2 border-primary w-fit flex flex-row items-center">
      {stepIcon && (
        <FontAwesomeIcon
          className="h-5 w-5 mr-3"
          size="sm"
          icon={stepIcon}
          color={"white"}
        />
      )}
      <h2>{children}</h2>
    </div>
  );
};

export default StepTitle;
