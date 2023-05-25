import React, { useEffect, useState } from "react";
import * as THREE from "three";
import userFunction from "../../helpers/userFunction";
import CodeBlock from "../code/CodeBlock";
import CodeText from "../tutorialHelpers/CodeText";
import Assignment from "../tutorialHelpers/Assignment";
import CodeBlockInline from "../code/CodeBlockInline";
import Image from "next/image";
import StepTitle from "../tutorialHelpers/StepTitle";

const code = `// Basic setup
const canvas = document.getElementById("canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;

export const rendererSceneFunction = (userScript: string) => {
  userFunction(userScript, ["THREE"], [THREE]);
};

const assignments = {
  codeOpened: {
    title:
      "Open up the code tab by dragging the left slider on the right side of your screen.",
    hint: "On the right you see 2 handles. Drag the left one!",
    subParagraph:
      "Well done. Now here is where I will show you the code written with every step of the tutorial and is also where you will be able to write your own code as we go along",
    checked: false,
  },
  canvasOpened: {
    title: "Lets also open up the output tab. Drag the other slider!",
    hint: "On the right you see 2 handles. Drag the right one!",
    subParagraph:
      "Alright, here is the ouput of our code. As you can see right now we are just rendering a blue screen. Lets change that with the next step!",
    checked: false,
  },
};

const assignmentCheck = (codeBlockWidth: number, canvasWidth: number) => {
  if (!assignments) return;
  const assignmentsClone = JSON.parse(JSON.stringify(assignments));
  assignments.codeOpened.checked = codeBlockWidth > 350;
  assignments.canvasOpened.checked = canvasWidth > 350;
  if (
    assignmentsClone.codeOpened.checked !== assignments.codeOpened.checked ||
    assignmentsClone.canvasOpened.checked !== assignments.canvasOpened.checked
  )
    return true;
};

const Renderer: React.FC = () => {
  const [resetKey, setResetKey] = useState(Date.now());

  const update = () => {
    const codeBlock = document.getElementById("ResizableCode");
    const canvasBlock = document.getElementById("ResizableCanvas");
    if (!codeBlock || !canvasBlock) return;
    const updated = assignmentCheck(
      codeBlock.clientWidth,
      canvasBlock.clientWidth
    );

    if (updated) setResetKey(Date.now());
  };

  useEffect(() => {
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, [resetKey]);

  return (
    <>
      <CodeText>
        <StepTitle>Creating a scene</StepTitle>
        <h3 className="mt-p">Basic setup</h3>
        <p>
          First thing we need to do before the fun stuff is creating a scene and
          adding a few things to it.
        </p>
        <p>
          We starting by adding a canvas to our html with the ID of canvas.
          After this we can work on our javascript:
        </p>
        <CodeBlockInline>
          {`import * as THREE from "three";

const canvas = document.getElementById("canvas"); 
const scene = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 2000 );

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);`}
        </CodeBlockInline>
        <p>
          Let's take a moment to explain what's going on here. We have now set
          up the scene, our camera and the renderer.
        </p>
        <h3 className="mt-p">Camera's</h3>
        <p>
          There are different types of cameras in Three.js for most cases you
          will use the Perspective camera.{" "}
        </p>
        <p>Its first value is the FOV or field of view in degrees.</p>
        <p>
          The second value is the aspect ratio. 99,9% precent of the time you
          will use the size of the canvas otherwise the image will look squished
          or stretched.
        </p>
        <p>
          The other two values are the near and far plane. Anything outside of
          those planes will not be rendered.
        </p>
        <div className="relative my-2 w-[300px] h-[200px]">
          <Image
            src="/images/perspectiveCameraExplenation.png"
            fill
            sizes="30vw"
            alt="back button"
          ></Image>
        </div>
        <h3 className="mt-p">Renderer</h3>
        <p>
          Next up is the renderer. When setting the renderer size you will also
          almost always want to set it to the width and height of your canvas.
          We also set the background color to blue.
        </p>
        <h3 className="mt-p">Animation loop</h3>
        <p>
          Now for actually rendering our scene we use an animation or render
          loop
        </p>
        <CodeBlockInline>
          {`function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`}
        </CodeBlockInline>
        <p>
          This code causes an animation loop that draws the scene everytime the
          screen is refreshed. (typically 60 times per second)
        </p>

        <p>
          Okay. Lets combine everything mentioned above. On the right you will
          see 2 sliders. Try opening up the left of them.
        </p>
        <Assignment assignments={assignments}></Assignment>
      </CodeText>
      <CodeBlock code={code}></CodeBlock>
    </>
  );
};

export default Renderer;
