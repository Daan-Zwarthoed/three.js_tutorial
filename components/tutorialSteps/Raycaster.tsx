import React, { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import CodeText from "../tutorialHelpers/CodeText";
import CodeBlockInline from "../code/CodeBlockInline";
import userFunction from "../../helpers/userFunction";
import AppContext from "../../contexts/AppContextProvider";
import CodeBlock from "../code/CodeBlock";
import Assignment from "../tutorialHelpers/Assignment";

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
      if (INTERSECTED)
        INTERSECTED.material.color.set(INTERSECTEDCOLOR);
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
animate();`;
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
  canvas.removeEventListener("mousemove", (event) => assignmentCheck(event));
  canvas.addEventListener("mousemove", (event) => assignmentCheck(event));
};

const assignments = {
  scaleCube: {
    title: "Make it so that if you hover on a cube it becomes 1.1 times larger",
    hint: "You can make something larger by using scale.set()",
    checked: false,
  },
  scaleCubeDown: {
    title: "Make sure the cube's also go back to their original size!",
    hint: "Everywhere were INTERSECTEDCOLOR used to be applied is the places you should scale the cube back down.",
    subParagraph:
      "Okay well done. Now you have the basic understanding of raycasters down!",
    checked: false,
  },
};

let INTERSECTED: THREE.Object3D | null;
const assignmentCheck = (event: any) => {
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
    (assignmentsClone.scaleCube.checked !== assignments.scaleCube.checked ||
      assignmentsClone.scaleCubeDown.checked !==
        assignments.scaleCubeDown.checked) &&
    update
  )
    update();
};
// Correct answer
`  
if (intersect) {
  if (intersect !== INTERSECTED) {
    if (INTERSECTED)
    INTERSECTED.scale.set(1, 1, 1);
    INTERSECTED = intersect;
    intersect.scale.set(1.1, 1.1, 1.1);
  }
} else if (INTERSECTED) {
  INTERSECTED.scale.set(1, 1, 1);
  INTERSECTED = null;
  }
}
`;

let update: () => void;
const Raycaster: React.FC = () => {
  const [resetKey, setResetKey] = useState(Math.random());

  update = () => {
    setResetKey(Math.random());
  };
  return (
    <>
      <CodeText>
        <h2>Code block for raycasters</h2>
        <p>
          To make objects react to the users cursor you will need to use a
          raycaster
        </p>
        <CodeBlockInline>{`const pointer = new THREE.Vector2();

function onPointerMove(event) {
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;
}

canvas.addEventListener("mousemove", onPointerMove);`}</CodeBlockInline>
        <p>
          This code will keep track of the x and y value of the cursor on the
          canvas in normalized device coordinates. Now for using this to change
          the color of the cube:
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
        <p>
          This looks very overwhelming at first glance but dont worry. I'll take
          you through it step by step.
        </p>
        <ol>
          <li className="my-3">
            First we <strong>raycast</strong> with all the objects in the scene.
            We get the first intersection and save its object.
          </li>
          <li className="my-3">
            Next we check if <strong>intersect</strong> exists and if it's a new
            intersection. If this is true we reverse the previous intersection
            if necessary, we save the new intersect in INTERSECTED and we clone
            the color to INTERSECTEDCOLOR. Then we set our new intersection to a
            darkish red.
          </li>
          <li className="my-3">
            If intersect <strong>doesn't</strong> exist we check if our
            INTERSECTED exists and reset it if it does.
          </li>
        </ol>
        <p>To make sure you actually understand it. Do it yourself!</p>
        <Assignment assignments={assignments}></Assignment>{" "}
      </CodeText>
      <CodeBlock code={code}></CodeBlock>
    </>
  );
};

export default Raycaster;
