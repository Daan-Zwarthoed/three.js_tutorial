import { stepList } from "../pages/tutorial";
import Router from "next/router";

export const getStepIndex = () => {
  return stepList.findIndex((item) => item.id === Router.query.step);
};

export const getStepCurrent = () => {
  const routerStepIndex = getStepIndex();

  return stepList[routerStepIndex];
};

export const getStepFromCurrent = (indexDifference: number) => {
  const routerStepIndex = getStepIndex();

  return stepList[routerStepIndex + indexDifference];
};
