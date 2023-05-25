// Add a window resize listener to the working code
const windowResize = `
const handleResizeWindowBehindTheScreens = () => {
  if (!canvas.parentElement || !renderer || !camera) return;
  renderer.setSize(
    canvas.parentElement.clientWidth,
    canvas.parentElement.clientHeight,
    true
  );
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}
window.removeEventListener("resize", handleResizeWindowBehindTheScreens);
window.addEventListener("resize", handleResizeWindowBehindTheScreens);`;

// Return necessary things to check assignments
const returnVarFunction = (returnVar?: string | string[]) => {
  if (!returnVar) return "";
  if (typeof returnVar === "string")
    return `try {
      return ${returnVar}; 
    } catch (error) {
      error;
    }`;

  const returnVars = JSON.stringify(returnVar);
  return `try {
      const returnThis = [];
      ${returnVars}.forEach(variable => {
        try { 
          returnThis.push(eval(variable));
        } catch (error) {
          returnThis.push(undefined);
        }
      });
      return returnThis;
    } catch (error) {
      error;
    }`;
};

// Fire function
const userFunction = (
  userScript: string,
  paramNames?: string[],
  params?: any[],
  returnVar?: string | string[]
) => {
  const script = userScript + windowResize + returnVarFunction(returnVar);
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
