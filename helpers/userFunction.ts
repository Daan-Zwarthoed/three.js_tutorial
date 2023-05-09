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
