import React, { useContext, useState } from "react";
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
import * as FA from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Note from "../tutorialHelpers/Note";
import StepTitle from "../tutorialHelpers/StepTitle";

const ControlsTypes = [
  "Arcball",
  "Trackball",
  "Orbit",
  "Fly",
  "FirstPerson",
  "PointerLock",
  "Drag",
  "Transform",
] as const;
type ControlsMode = (typeof ControlsTypes)[number];

// We use an eval to use these
const importArcball = `import { ArcballControls } from 'three/addons/controls/ArcballControls.js';`;
const importDrag = `import { DragControls } from 'three/addons/controls/DragControls.js';`;
const importFirstPerson = `import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';`;
const importFly = `import { FlyControls } from 'three/addons/controls/FlyControls.js';`;
const importOrbit = `import { OrbitControls } from 'three/addons/controls/OrbitControls.js';`;
const importPointerLock = `import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';`;
const importTrackball = `import { TrackballControls } from 'three/addons/controls/TrackballControls.js';`;
const importTransform = `import { TransformControls } from 'three/addons/controls/TransformControls.js';`;

const defaultCodeBefore = `
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
  color: 0xd25e2f,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Controls
`;

// We use an eval to use these
const afterCodeArcball = `new ArcballControls(camera, renderer.domElement);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;

const afterCodeDrag = `new DragControls(scene.children, camera, renderer.domElement);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
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

const afterCodeTransform = `const controls = new TransformControls(camera, renderer.domElement);
controls.attach(cube);
controls.setMode("scale"); // "translate", "rotate" or "scale"
scene.add(controls);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;

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

const assignments = {
  addOrbitControls: {
    title: "Add orbit controls to the scene.",
    hint: "You can use the buttons above to select orbit controls.",
    checked: false,
  },
  autoRotate: {
    title: "Set the orbit controls to autoRotate",
    hint: "`autoRotate` is a property of controls that you can set to `true`.",
    subParagraph:
      "Okay, well done! However, you may notice that the cube is not rotating on its own yet. To achieve that, you will need to update the controls on every animation loop.",
    checked: false,
  },
  updateControls: {
    title: "Update the controls on every animation loop.",
    hint: "`update` is a function that you can call on controls.",
    subParagraph:
      "Well done! As you can see, the cube is now rotating on its own.",
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
    if (initialAzimuthalAngle !== controls.getAzimuthalAngle()) {
      const needsUpdate = !assignments.updateControls.checked;
      assignments.updateControls.checked = true;
      if (needsUpdate) update();
    }
  });
};

const returnControlsIcon = (controlsMode: ControlsMode): FA.IconDefinition => {
  if (controlsMode === "Arcball") return FA.faSatellite;
  if (controlsMode === "Drag") return FA.faUpDownLeftRight;
  if (controlsMode === "FirstPerson") return FA.faVrCardboard;
  if (controlsMode === "Fly") return FA.faPlane;
  if (controlsMode === "Orbit") return FA.faSatellite;
  if (controlsMode === "PointerLock") return FA.faLock;
  if (controlsMode === "Trackball") return FA.faSatellite;
  if (controlsMode === "Transform") return FA.faUpRightAndDownLeftFromCenter;
  return FA.faQuestion;
};

let update: () => void;

const Addons: React.FC = () => {
  const { setResetCanvasKey } = useContext(AppContext);
  const [resetKey, setResetKey] = useState(Math.random());
  const [controlsMode, setControlsMode] = useState<ControlsMode>("Arcball");
  let lightScript = defaultCodeBefore + eval("afterCode" + controlsMode);

  update = () => {
    setResetKey(Math.random());
  };
  return (
    <>
      <CodeText>
        <StepTitle>Addons and controls</StepTitle>
        <p className="mt-p">
          Three.js by itself contains all the fundamentals of a 3D engine. Other
          Three.js components like controls, loaders, and post-processing need
          to be imported separately from the addons/ directory. Note that you
          don't need to install them separately, just import them separately.
        </p>
        <p>
          Try dragging the cube, and you will see that you can now control it!
        </p>
        <p className="mt-p">
          Adding controls will in most cases look something like this.
        </p>
        <CodeBlockInline>
          {`import { OrbitControls } from "three/addons/controls/OrbitControls";`}
        </CodeBlockInline>
        <Note>
          If you installed Three.js with a CDN, you will need to add an
          importmap to the {"<head>"} element of your HTML. You can find more
          information about import maps in the{" "}
          <a
            className="text-accent underline"
            target="_blank"
            href="https://threejs.org/docs/#manual/en/introduction/Installation"
          >
            installation guide.
          </a>
        </Note>
        <h3 className="mt-p">Controls</h3>
        <div className="grid grid-cols-6 w-full my-5 border-offWhite border-t-2 border-l-2">
          {ControlsTypes.map((type, index) => (
            <button
              key={type}
              className={`relative w-full text-center flex flex-row justify-center items-center py-4 border-offWhite border-r-2 border-b-2 ${
                index > 5 ? "col-span-3" : "col-span-2"
              }`}
              onClick={() => {
                setResetCanvasKey(Math.random());
                if (renderer) {
                  renderer.dispose();
                  renderer.forceContextLoss();
                }
                setControlsMode(type);
              }}
            >
              <p className="relative z-10 mr-2">{type}</p>
              <FontAwesomeIcon
                className="relative z-10 h-5 w-5"
                size="sm"
                icon={returnControlsIcon(type)}
                color={"white"}
              />
              <div
                className={`absolute transition-all duration-700 bg-backgroundActive left-0 h-full top-0`}
                style={{
                  width: controlsMode === type ? "100%" : 0,
                }}
              ></div>
            </button>
          ))}
        </div>
        <p>
          {controlsMode === "Arcball" &&
            "The arcball controls simulate a virtual sphere that surrounds the 3D scene. It allows users to rotate the camera by clicking and dragging on the surface of the sphere."}
          {controlsMode === "Trackball" &&
            "The trackball controls simulate a virtual trackball that enables users to rotate the camera around a target point. It offers intuitive navigation similar to how a physical trackball works."}
          {controlsMode === "Orbit" &&
            "On the other hand, the orbit controls provide a simplified way to control the camera by orbiting it around a target point. This control scheme resembles the way a planet orbits around the sun and is the most widely used implementation of controls in Three.js."}
          {controlsMode === "Fly" &&
            "FlyControls enables navigation similar to fly modes in DCC (Digital Content Creation) tools like Blender. You can freely move the camera in 3D space using the WASD or arrow keys."}
          {controlsMode === "FirstPerson" &&
            "First-person controls provide an alternative implementation of fly controls, giving the feeling of walking around a scene as a person rather than flying."}
          {controlsMode === "PointerLock" &&
            "Pointer lock controls lock the user's mouse and utilize its movement to determine the camera's orientation. This is ideal for first-person games."}
          {controlsMode === "Drag" &&
            "Drag controls are used for drag and drop interactions. They allow control over objects in the scene but not the camera itself."}
          {controlsMode === "Transform" &&
            "Transform controls are used to manipulate 3D objects in a similar way to DCC tools like Blender. Like drag controls, this does not involve controlling the camera but only the objects in the scene."}
        </p>
        {(controlsMode === "Fly" || controlsMode === "FirstPerson") && (
          <Note>
            Both first-person and fly controls are designed specifically for
            fullscreen usage. As a result, in this example, when hovering over
            the canvas, the camera will continuously pan to the right.
          </Note>
        )}
        <Assignment assignments={assignments}></Assignment>
      </CodeText>

      <CodeBlock
        showImports={eval("import" + controlsMode)}
        code={lightScript}
        scrollToLine={29}
      ></CodeBlock>
    </>
  );
};

export default Addons;
