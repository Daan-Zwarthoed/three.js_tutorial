import React from "react";

export const FireConfettiPositionContext = () => {
  const [fireConfettiPosition, setFireConfettiPosition] =
    React.useState<fireConfettiPositionType | null>(null);

  return { fireConfettiPosition, setFireConfettiPosition };
};

export type fireConfettiPositionType = {
  x: number;
  y: number;
};
