import React, { useEffect } from "react";

let initialLoad = true;

export const AccesibleStepsContext = () => {
  const [accessibleSteps, setAccessibleSteps] = React.useState<string[]>([]);

  const getAccessibleSteps = () => {
    const stringifydAccessibleSteps =
      window.localStorage.getItem("Accessible_Steps");
    if (!stringifydAccessibleSteps) return;
    const parsedAccessibleSteps = JSON.parse(stringifydAccessibleSteps);
    setAccessibleSteps(parsedAccessibleSteps);
  };

  useEffect(() => {
    getAccessibleSteps();
  }, []);

  const saveAccessibleSteps = () => {
    if (initialLoad) return (initialLoad = false);
    window.localStorage.setItem(
      "Accessible_Steps",
      JSON.stringify(accessibleSteps)
    );
  };

  useEffect(() => {
    saveAccessibleSteps();
  }, [accessibleSteps]);
  return { accessibleSteps, setAccessibleSteps };
};
