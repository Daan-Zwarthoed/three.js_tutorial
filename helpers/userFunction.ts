const windowResize = `
window.addEventListener("resize", function () {
  if (!canvas.parentElement || !renderer || !camera) return;
  renderer.setSize(
    canvas.parentElement.clientWidth,
    canvas.parentElement.clientHeight,
    true
  );
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
});`;

const returnVarFunction = (returnVar?: string | string[]) => {
  if (!returnVar) return "";
  if (typeof returnVar === "string") {
    return `try {
      return ${returnVar}; 
    } catch (error) {
      error;
    }`;
  } else {
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
  }
};

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
