import React from "react";
import * as THREE from "three";
import userFunction from "../../helpers/userFunction";
import CodeBlock from "../code/CodeBlock";
import CodeBlockInline from "../code/CodeBlockInline";
import CodeText from "../tutorialHelpers/CodeText";
import Assignment from "../tutorialHelpers/Assignment";
import Note from "../tutorialHelpers/Note";
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
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);



// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  try {
    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
  } catch (error) {
    error;
  }
}

animate();`;

export const boxSceneFunction = (userScript: string) => {
  const cube = userFunction(userScript, ["THREE"], [THREE], "cube");
  if (cube) assignmentCheck(cube);
};

const assignments = {
  cubeExists: {
    title:
      "Add your own cube to the scene! You can apply your code using the save button, or by using Ctrl + S or Cmd + S.",
    hint: "You can copy the code in the code block above and paste it somewhere in the code on the right.",
    checked: false,
  },
  cubeIsCone: {
    title: "Make the cube a ConeGeometry.",
    hint: "You already have a CubeGeometry in your code. Maybe you can update that?",
    subParagraph:
      "Okay, good! There are a lot of geometries available, such as a circle, cone, cylinder, and many others.",
    checked: false,
  },
  cubeIsOrange: {
    title: "Change the color to: 0xd25e2f.",
    hint: "It follows the same principle as the previous assignment.",
    checked: false,
  },
};

const assignmentCheck = (cube: THREE.Mesh) => {
  if (!cube) return;

  if (cube) assignments.cubeExists.checked = true;

  if (cube.geometry && cube.geometry.type === "ConeGeometry")
    assignments.cubeIsCone.checked = true;

  if (
    cube.material &&
    (cube.material as THREE.MeshBasicMaterial).color &&
    (cube.material as THREE.MeshBasicMaterial).color.equals(
      new THREE.Color(0xd25e2f)
    )
  )
    assignments.cubeIsOrange.checked = true;
};

const Box: React.FC = () => {
  return (
    <>
      <CodeText>
        <StepTitle>Adding a cube</StepTitle>
        <p className="mt-p">
          There are a lot of things you can add to a scene, but let's start
          simple by creating and adding a cube.
        </p>
        <p>To create a cube, we need three things:</p>
        <ol className="my-ol">
          <li className="my-li">
            First, we need a <strong>BoxGeometry</strong>. This object contains
            all the points and sides of the cube.
          </li>
          <li className="my-li">
            Next, we need a <strong>Material</strong> to color the cube.
            Three.js provides several materials, but for now, let's use the
            MeshBasicMaterial. All materials take an object of properties that
            will be applied to them.
          </li>
          <li className="my-li">
            The third thing we need is a <strong>Mesh</strong>. A mesh is an
            object that takes a geometry and applies a material to it. We can
            then insert it into our scene and move it freely.
          </li>
        </ol>
        <p>Combining all of that will look like this:</p>
        <CodeBlockInline>{`const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ 
  color: 0xd63e4d
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);`}</CodeBlockInline>
        <Assignment assignments={assignments}></Assignment>{" "}
        <Note>
          Note that we moved the camera back a bit. This is because anything
          added to the scene will be placed at coordinates 0, 0, 0. Without
          moving the camera, it would be inside the cube.
        </Note>
        <Note>
          Also, notice that in our animation loop, we are rotating the cube on
          every frame.
        </Note>
      </CodeText>
      <CodeBlock code={code}></CodeBlock>
    </>
  );
};

export default Box;
