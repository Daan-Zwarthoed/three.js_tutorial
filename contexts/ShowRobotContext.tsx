import React from "react";

export const ShowRobotContext = () => {
  const [showRobot, setShowRobot] = React.useState<ShowRobotType | null>(null);
  return { showRobot, setShowRobot };
};

export type ShowRobotType = {
  confetti?: true;
  text?: string;
  nextButton?: boolean;
};
