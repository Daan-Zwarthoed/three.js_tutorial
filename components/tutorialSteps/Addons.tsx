import React, { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import userFunction from "../../helpers/userFunction";
import CodeBlock from "../code/CodeBlock";
import CodeBlockInline from "../code/CodeBlockInline";
import { ArcballControls } from "three/examples/jsm/controls/ArcballControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

import CodeText from "../tutorialHelpers/CodeText";
import AppContext from "../../contexts/AppContextProvider";
import Assignment from "../tutorialHelpers/Assignment";

const ControlsTypes = [
  "Arcball",
  "Drag",
  "FirstPerson",
  "Fly",
  "Orbit",
  "PointerLock",
  "Trackball",
  "Transform",
] as const;
type ControlsMode = (typeof ControlsTypes)[number];

const beforeCodeArcball = `import { ArcballControls } from 'three/addons/controls/ArcballControls.js';`;
const beforeCodeDrag = `import { DragControls } from 'three/addons/controls/DragControls.js';`;
const beforeCodeFirstPerson = `import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';`;
const beforeCodeFly = `import { FlyControls } from 'three/addons/controls/FlyControls.js';`;
const beforeCodeOrbit = `import { OrbitControls } from 'three/addons/controls/OrbitControls.js';`;
const beforeCodePointerLock = `import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';`;
const beforeCodeTrackball = `import { TrackballControls } from 'three/addons/controls/TrackballControls.js';`;
const beforeCodeTransform = `import { TransformControls } from 'three/addons/controls/TransformControls.js';`;

const code = `
// Basic setup
const canvas = document.getElementById("canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);
camera.position.set(30, 30, 30); 
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);

// Add objects
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({
  color: "#d63e4d",
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Controls
`;

const afterCodeArcball = `const controls = new ArcballControls(camera, renderer.domElement);

// Animation loop
function animate() {
  id = requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

animate();`;

const afterCodeDrag = `new DragControls(scene.children, camera, renderer.domElement);

// Animation loop
function animate() {
  id = requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();`;

const afterCodeFirstPerson = `const controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 50;

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  const delta = clock.getDelta();
  controls.update(delta);
}
animate();`;

const afterCodeFly = `const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 50;

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  const delta = clock.getDelta();
  controls.update(delta);
}
animate();`;

const afterCodeOrbit = `const controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;

const afterCodePointerLock = `const controls = new PointerLockControls(camera, renderer.domElement);

canvas.addEventListener("click", () => {
  if (canvas) controls.isLocked ? controls.unlock() : controls.lock();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;

const afterCodeTrackball = `const controls = new TrackballControls(camera, renderer.domElement);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  controls.update();
}
animate();`;

const afterCodeTransform = `const controls = new TransformControls (camera, renderer.domElement);
controls.attach(cube);
controls.setMode("scale"); // "translate", "rotate" or "scale"
scene.add(controls);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;

const assignments = {
  addOrbitControls: {
    title: "Add orbit controls to the scene",
    hint: "You can use the buttons above to select orbit controls",
    checked: false,
  },
  autoRotate: {
    title: "Set the controls to autoRotate",
    hint: "autoRotate is a value of controls you can set to true",
    subParagraph:
      "Okay well done! But as you might see the cube is not rotating on its own yet. For that you will need to update the controls on every animation loop.",
    checked: false,
  },
  updateControls: {
    title: "Update the controls on every animation loop",
    hint: "Update is a function you can call on controls",
    subParagraph:
      "Well done as you can see the cube is rotating on its own now!",
    checked: false,
  },
};

const assignmentCheck = (controls: OrbitControls) => {
  if (!controls) return;
  if (controls instanceof OrbitControls) {
    assignments.addOrbitControls.checked = true;
  } else return;
  if (controls.autoRotate) assignments.autoRotate.checked = true;
  const initialAzimuthalAngle = controls.getAzimuthalAngle();
  setTimeout(() => {
    if (initialAzimuthalAngle !== controls.getAzimuthalAngle())
      assignments.updateControls.checked = true;
  });
};

let renderer: THREE.WebGLRenderer | undefined;

export const addonsSceneFunction = (userScript: string) => {
  const rendererAndControls = userFunction(
    userScript,
    [
      "THREE",
      "ArcballControls",
      "DragControls",
      "FirstPersonControls",
      "FlyControls",
      "OrbitControls",
      "PointerLockControls",
      "TrackballControls",
      "TransformControls",
    ],
    [
      THREE,
      ArcballControls,
      DragControls,
      FirstPersonControls,
      FlyControls,
      OrbitControls,
      PointerLockControls,
      TrackballControls,
      TransformControls,
    ],
    ["renderer", "controls"]
  );
  if (!rendererAndControls) return;
  renderer = rendererAndControls[0];
  assignmentCheck(rendererAndControls[1]);
};

const Addons: React.FC = () => {
  const { setUserScript, setResetCanvasKey } = useContext(AppContext);
  const [controlsMode, setControlsMode] = useState<ControlsMode>("Arcball");
  let lightScript = code + eval("afterCode" + controlsMode);

  return (
    <>
      <CodeText>
        <h2>Add your own Addons to the scene</h2>
        <p>
          Three.js by itself contains all the fundementals of a 3D engine. Other
          Three.js components like controls, loaders and post-processing need to
          be imported seperatly from the addons/ directory. Note that you don't
          need to install them seperatly just import them seperatly.
        </p>
        <p>
          Try dragging the cube and you will see that you can now control it!
        </p>
        <p className="mt-2">
          Importing controls will in most cases look like this:
        </p>
        <CodeBlockInline>
          {`import { OrbitControls } from 'three/addons/controls/OrbitControls.js';`}
        </CodeBlockInline>
        <p>Using typescript it will look like this:</p>
        <CodeBlockInline>
          {`import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";`}
        </CodeBlockInline>
        <p>
          If you installed Three.js with a CDN you will need to add an importmap
          to the head element of your html. You can read more about import maps
          in the{" "}
          <a
            className="text-blue-500 underline"
            target="_blank"
            href="https://threejs.org/docs/#manual/en/introduction/Installation"
          >
            installation guide.
          </a>
        </p>
        <div className="flex flex-col w-full my-5">
          {ControlsTypes.map((type) => (
            <button
              key={type}
              className={`relative w-full text-center py-4 border-secondary border-2 first:border-t-2 border-t-0`}
              onClick={() => {
                setResetCanvasKey(Math.random());
                if (renderer) {
                  renderer.dispose();
                  renderer.forceContextLoss();
                }
                setControlsMode(type);
              }}
            >
              <p className="relative z-10">{type}</p>
              <div
                className={`absolute transition-all duration-700 bg-tertary left-0 h-full top-0`}
                style={{
                  width: controlsMode === type ? "100%" : 0,
                }}
              ></div>
            </button>
          ))}
        </div>
        <Assignment assignments={assignments}></Assignment>
      </CodeText>

      <CodeBlock
        showImports={eval("beforeCode" + controlsMode)}
        code={lightScript}
        scrollToLine={29}
      ></CodeBlock>
    </>
  );
};

export default Addons;
