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
      "Add your own cube to the scene! You can apply your code with the save button, ctrl + s or cmd + s.",
    hint: "You can copy the code in the codeblock above and paste it somewhere in the code on the right",
    checked: false,
  },
  cubeIsCone: {
    title: "Make the cube a ConeGeometry",
    hint: "You already have a CubeGeometry in your code. Maybe you can update that?",
    subParagraph:
      "Okay good! There are alot of geometries like circle, cone, cylinder and a bunch of others.",
    checked: false,
  },
  cubeIsOrange: {
    title: "Change the color to: 0xd25e2f",
    hint: "Its the same principle as with the last assignment.",
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
        <p className="mt-8">
          There are alot of things you can add to a scene but lets start simple
          by creating and adding a cube.
        </p>
        <p>To create a cube, we need three things:</p>
        <ol className="my-5">
          <li className="my-3">
            First we need a <strong>BoxGeometry</strong>. This is an object that
            contains all the points and sides of the cube.
          </li>
          <li className="my-3">
            We also need a <strong>Material</strong> to color the cube. Three.js
            comes with several materials, but we'll stick to the
            MeshBasicMaterial for now. All materials take an object of
            properties which will be applied to them.
          </li>
          <li className="my-3">
            The third thing we need is a <strong>Mesh</strong>. A mesh is an
            object that takes a geometry, and applies a material to it, which we
            then can insert to our scene, and move around freely.
          </li>
        </ol>
        <p>Combining all of that will look a little something like this:</p>
        <CodeBlockInline>{`const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ 
  color: 0xd63e4d
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);`}</CodeBlockInline>
        <Assignment assignments={assignments}></Assignment>{" "}
        <Note>
          Take note of the fact we moved the camera back a bit. This is because
          anything added to the scene will be added at the coordinates 0, 0, 0
          so the camera would be inside of the cube.
        </Note>
        <Note>
          Also note that in our animation loop we are rotating the cube on every
          frame.
        </Note>
      </CodeText>
      <CodeBlock code={code}></CodeBlock>
    </>
  );
};

export default Box;
