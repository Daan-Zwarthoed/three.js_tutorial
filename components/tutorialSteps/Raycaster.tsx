import React, { useState } from "react";
import * as THREE from "three";
import CodeText from "../tutorialHelpers/CodeText";
import CodeBlockInline from "../code/CodeBlockInline";
import userFunction from "../../helpers/userFunction";
import CodeBlock from "../code/CodeBlock";
import Assignment from "../tutorialHelpers/Assignment";
import StepTitle from "../tutorialHelpers/StepTitle";

const code = `// Basic setup
const canvas = document.getElementById("canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);
camera.position.z = 40;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);

// Add objects
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
const cube = new THREE.Mesh(geometry, material);
cube.position.x = -7;

const material2 = new THREE.MeshBasicMaterial({ color: "#ffff99" });
const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.x = 7;

scene.add(cube);
scene.add(cube2);

// Raycaster setup
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;
}

window.addEventListener("mousemove", onPointerMove);

// Raycast
let INTERSECTED = null;
let INTERSECTEDCOLOR = null;

function raycast() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  const intersect = intersects[0] && intersects[0].object;

  if (intersect) {
    if (intersect !== INTERSECTED) {
      if (INTERSECTED) INTERSECTED.material.color.set(INTERSECTEDCOLOR);
      INTERSECTED = intersect;
      INTERSECTEDCOLOR = intersect.material.color.clone();
      intersect.material.color.set(0xff0000);
    }
  } else if (INTERSECTED) {
    INTERSECTED.material.color.set(INTERSECTEDCOLOR);
    INTERSECTED = null;
  }
}

// Animation loop
function animate() {
  raycast();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
`;

let raycaster: THREE.Raycaster;
let camera: THREE.Camera;
let scene: THREE.Scene;

export const raycasterSceneFunction = (userScript: string) => {
  const raycasterCameraAndScene = userFunction(
    userScript,
    ["THREE"],
    [THREE],
    ["raycaster", "camera", "scene"]
  );
  if (!raycasterCameraAndScene) return;
  raycaster = raycasterCameraAndScene[0];
  camera = raycasterCameraAndScene[1];
  scene = raycasterCameraAndScene[2];

  const canvas = document.getElementById("canvas");
  if (!canvas) return;
  canvas.removeEventListener("mousemove", assignmentCheck);
  canvas.addEventListener("mousemove", assignmentCheck);
};

const assignments = {
  scaleCube: {
    title:
      "Modify the code so that when you hover over a cube, it becomes 1.1 times larger.",
    hint: "You can increase the size of an object using scale.set().",
    checked: false,
  },
  scaleCubeDown: {
    title:
      "Make sure the cubes go back to their original size when not being hovered over.",
    hint: "You should scale the cube back down wherever INTERSECTEDCOLOR is used.",
    subParagraph:
      "Well done! Now you have a basic understanding of raycasters.",
    checked: false,
  },
};

let INTERSECTED: THREE.Object3D | null;
const assignmentCheck = (event: MouseEvent) => {
  if (!raycaster || !camera || !scene) return;
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  const pointer = new THREE.Vector2();
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  const intersect = intersects[0] && intersects[0].object;
  const assignmentsClone = JSON.parse(JSON.stringify(assignments));

  if (intersect) {
    INTERSECTED = intersect;
    if (intersect.scale.equals(new THREE.Vector3(1.1, 1.1, 1.1)))
      assignments.scaleCube.checked = true;
  } else if (INTERSECTED) {
    if (
      INTERSECTED.scale.equals(new THREE.Vector3(1, 1, 1)) &&
      assignments.scaleCube.checked
    ) {
      assignments.scaleCubeDown.checked = true;
      INTERSECTED = null;
    }
  }
  if (
    assignmentsClone.scaleCube.checked !== assignments.scaleCube.checked ||
    assignmentsClone.scaleCubeDown.checked !== assignments.scaleCubeDown.checked
  )
    update();
};

let update: () => void;
const Raycaster: React.FC = () => {
  const [resetKey, setResetKey] = useState(Math.random());

  update = () => {
    setResetKey(Math.random());
  };
  return (
    <>
      <CodeText>
        <StepTitle>Raycasters</StepTitle>
        <p className="mt-p">
          To make objects react to the user's cursor, you will need to use a
          raycaster. A raycaster returns all intersections between objects in
          the scene and the location of the mouse. To perform raycasting, we
          first need to obtain the current position of the mouse in normalized
          device coordinates. We can do this using the following code:
        </p>
        <CodeBlockInline>{`const pointer = new THREE.Vector2();

function onPointerMove(event) {
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;
}

canvas.addEventListener("mousemove", onPointerMove);`}</CodeBlockInline>
        <p className="mt-p">
          Once we have the mouse coordinates, we can use them to change the
          color of the cube:
        </p>
        <CodeBlockInline>{`raycaster.setFromCamera(pointer, camera);
const intersects = raycaster.intersectObjects(scene.children, false);
const intersect = intersects[0] && intersects[0].object;

if (intersect) {
  if (intersect !== INTERSECTED) {
    if (INTERSECTED)
      INTERSECTED.material.color.set(INTERSECTEDCOLOR);
    INTERSECTED = intersect;
    INTERSECTEDCOLOR = intersect.material.color.clone();
    intersect.material.color.set(0xff0000);
  }
} else if (INTERSECTED) {
  INTERSECTED.material.color.set(INTERSECTEDCOLOR);
  INTERSECTED = null;
}`}</CodeBlockInline>
        <p className="mt-p">
          At first glance, this code may seem overwhelming, but don't worry.
          I'll walk you through it step by step.
        </p>
        <ol className="my-ol">
          <li className="my-li">
            First, we perform <strong>raycasting</strong> with all the objects
            in the scene. We retrieve the first intersection and save its
            corresponding object.
          </li>
          <li className="my-li">
            Next, we check if there is an <strong>intersection</strong>{" "}
            (`intersect`) and if it is a new intersection. If this condition is
            true, we reverse the previous intersection if necessary, save the
            new intersection in a variable called `INTERSECTED`, and clone the
            color to `INTERSECTEDCOLOR`. Then, we set the color of the new
            intersection to a darkish red.
          </li>
          <li className="my-li">
            If there is no intersection{" "}
            <strong>(intersect doesn't exist)</strong>, we check if our
            INTERSECTED variable exists and reset it if it does.
          </li>
        </ol>
        <Assignment assignments={assignments}></Assignment>{" "}
      </CodeText>
      <CodeBlock code={code} scrollToLine={33}></CodeBlock>
    </>
  );
};

export default Raycaster;
