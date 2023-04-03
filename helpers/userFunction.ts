const returnVarFunction = (returnVar?: string) => {
  if (!returnVar) return "";
  return `try {
    return ${returnVar};
  } catch (error) {
    console.log("No return");
  }`;
};

const userFunction = (
  userScript: string,
  paramNames?: string[],
  params?: any[],
  returnVar?: string
) => {
  const script = userScript + returnVarFunction(returnVar);
  try {
    if (userScript && params && paramNames) {
      return Function(...paramNames, script)(...params);
    } else if (userScript) {
      return Function(script);
    }
  } catch (error) {
    console.error(error);
  }
};

export default userFunction;
