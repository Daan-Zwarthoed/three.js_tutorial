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
      "Open the code tab by dragging the left slider on the right side of your screen.",
    hint: "On the right side, you will notice two handles. Drag the left handle to open the code tab.",
    subParagraph:
      "Well done. Now, this is where I will show you the code written with every step of the tutorial. It is also the place where you will be able to write your own code as we go along.",
    checked: false,
  },
  canvasOpened: {
    title: "Let's also open the output tab. Drag the other slider!",
    hint: "On the right side, you will see two handles. Drag the right handle to open the output tab.",
    subParagraph:
      "Alright, here is the output of our code. As you can see, we are currently rendering a blue screen. Let's change that in the next step!",
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
    return () => window.removeEventListener("resize", update);
  }, [resetKey]);

  return (
    <>
      <CodeText>
        <StepTitle>Creating a scene</StepTitle>
        <h3 className="mt-p">Basic setup</h3>
        <p>
          The first thing we need to do before diving into the fun stuff is to
          create a scene and add a few elements to it.
        </p>
        <p>
          To begin, let's add a canvas to our HTML with the ID of "canvas." Once
          that's done, we can proceed with the JavaScript code.
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
          Let's take a moment to explain what's happening in the code above. We
          have set up the scene, camera, and renderer.
        </p>
        <h3 className="mt-p">Cameras:</h3>
        <p>
          In Three.js, there are different types of cameras available, but in
          most cases, you will use the PerspectiveCamera.
        </p>
        <p>
          The first value of the camera represents the field of view (FOV) in
          degrees.{" "}
        </p>
        <p>
          The second value is the aspect ratio, which is usually set to the size
          of the canvas to avoid distortion.
        </p>
        <p>
          The last two values are the near and far planes, determining the
          rendering range.
        </p>
        <div className="relative my-2 w-[300px] h-[200px]">
          <Image
            src="/images/perspectiveCameraExplenation.png"
            fill
            sizes="30vw"
            alt="back button"
          ></Image>
        </div>
        <h3 className="mt-p">Renderer:</h3>
        <p>
          Next, we define the renderer. When setting the renderer size, it's
          generally recommended to match it with the width and height of your
          canvas. Additionally, we set the background color to blue.
        </p>
        <h3 className="mt-p">Animation loop</h3>
        <p>
          Now, let's move on to rendering our scene using an animation or render
          loop. The code provided creates a loop that redraws the scene every
          time the screen is refreshed, typically at a rate of 60 times per
          second.
        </p>
        <CodeBlockInline>
          {`function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`}
        </CodeBlockInline>
        <p>
          Okay, let's put everything we've mentioned above together. On the
          right side, you'll find two sliders. Try opening the left one.
        </p>
        <Assignment assignments={assignments}></Assignment>
      </CodeText>
      <CodeBlock code={code}></CodeBlock>
    </>
  );
};

export default Renderer;
