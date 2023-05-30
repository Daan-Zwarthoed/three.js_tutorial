import React, { useContext, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import CodeBlock from "../code/CodeBlock";
import CodeBlockInline from "../code/CodeBlockInline";
import CodeText from "../tutorialHelpers/CodeText";
import userFunction from "../../helpers/userFunction";
import AppContext from "../../contexts/AppContextProvider";
import Assignment from "../tutorialHelpers/Assignment";
import StepTitle from "../tutorialHelpers/StepTitle";

const beforeGsapCode = `import gsap from "gsap";
`;

const gsapCode = `// Basic setup
const canvas = document.getElementById("canvas");
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);

// Add objects
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material1 = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
const cube1 = new THREE.Mesh(geometry, material1);
cube1.position.x = -7;
cube1.position.y = 7;

const material2 = new THREE.MeshBasicMaterial({ color: "#34eb43" });
const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.x = 7;
cube2.position.y = 7;

const material3 = new THREE.MeshBasicMaterial({ color: "#ffff99" });
const cube3 = new THREE.Mesh(geometry, material3);
cube3.position.x = -7;
cube3.position.y = -7;

const material4 = new THREE.MeshBasicMaterial({ color: "#344feb" });
const cube4 = new THREE.Mesh(geometry, material4);
cube4.position.x = 7;
cube4.position.y = -7;

scene.add(cube1);
scene.add(cube2);
scene.add(cube3);
scene.add(cube4);

// Animate on click
function onClick(event) {
  if (!canvas) return;

  const pointer = new THREE.Vector2();
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  const intersect = intersects[0] && intersects[0].object;
  if (!intersect) return;

  gsap.to(camera.position, {
    ...new THREE.Vector2(intersect.position.x, intersect.position.y),
    duration: 1,
    ease: "power1.out",
  });
}
canvas.addEventListener("click", onClick);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
`;

const noGsapCode = `
// Basic setup
const canvas = document.getElementById("canvas");
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);

// Add objects
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material1 = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
const cube1 = new THREE.Mesh(geometry, material1);
cube1.position.x = -7;
cube1.position.y = 7;

const material2 = new THREE.MeshBasicMaterial({ color: "#34eb43" });
const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.x = 7;
cube2.position.y = 7;

const material3 = new THREE.MeshBasicMaterial({ color: "#ffff99" });
const cube3 = new THREE.Mesh(geometry, material3);
cube3.position.x = -7;
cube3.position.y = -7;

const material4 = new THREE.MeshBasicMaterial({ color: "#344feb" });
const cube4 = new THREE.Mesh(geometry, material4);
cube4.position.x = 7;
cube4.position.y = -7;

scene.add(cube1);
scene.add(cube2);
scene.add(cube3);
scene.add(cube4);

// Set animation goal on click
let cameraPositionGoal;
let animationDistance;

function onClick(event) {
  if (!canvas) return;

  const pointer = new THREE.Vector2();
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  const intersect = intersects[0] && intersects[0].object;
  if (!intersect) return;

  cameraPositionGoal = new THREE.Vector2(
    intersect.position.x,
    intersect.position.y
  );
  const animationTime = 100; // In frames
  animationDistance = new THREE.Vector2(
    (cameraPositionGoal.x - camera.position.x) / animationTime,
    (cameraPositionGoal.y - camera.position.y) / animationTime
  );
}
canvas.addEventListener("click", onClick);

// Animate camera to goal if it exists
function animateCamera() {
  if (!cameraPositionGoal || !animationDistance) return;
  if (
    camera.position.x.toFixed(5) === cameraPositionGoal.x.toFixed(5) &&
    camera.position.y.toFixed(5) === cameraPositionGoal.y.toFixed(5)
  )
    return (cameraPositionGoal = null);
  camera.position.x += animationDistance.x;
  camera.position.y += animationDistance.y;
}

// Animation loop
function animate() {
  animateCamera();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
`;

let raycaster: THREE.Raycaster;
let camera: THREE.Camera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

export const cameraAnimationSceneFunction = (userScript: string) => {
  const raycasterCameraSceneAndRenderer = userFunction(
    userScript,
    ["THREE", "gsap"],
    [THREE, gsap],
    ["raycaster", "camera", "scene"]
  );
  if (!raycasterCameraSceneAndRenderer) return;
  raycaster = raycasterCameraSceneAndRenderer[0];
  camera = raycasterCameraSceneAndRenderer[1];
  scene = raycasterCameraSceneAndRenderer[2];
  renderer = raycasterCameraSceneAndRenderer[3];

  const canvas = document.getElementById("canvas");
  if (!canvas) return;
  canvas.removeEventListener("click", assignmentCheck);
  canvas.addEventListener("click", assignmentCheck);
};

const assignments = {
  loadGLTF: {
    title:
      "Animate the scale of a cube to become smaller or larger when you click on it.",
    hint: "The target for your animation should be `intersect.scale`.",
    checked: false,
  },
};

const assignmentCheck = async (event: { clientX: number; clientY: number }) => {
  const canvas = document.getElementById("canvas");

  if (!raycaster || !canvas) return;
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  const pointer = new THREE.Vector2();

  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  const intersect = intersects[0] && intersects[0].object;

  if (!intersect) return;

  const assignmentsClone = JSON.parse(JSON.stringify(assignments));
  const scaleTween = gsap.getTweensOf(intersect.scale)[0];
  if (await scaleTween) assignments.loadGLTF.checked = true;
  if (assignmentsClone.loadGLTF.checked !== assignments.loadGLTF.checked)
    update();
};

let update: () => void;

const CameraAnimation: React.FC = () => {
  const { userScript, setResetCanvasKey } = useContext(AppContext);
  const [showCode, setShowCode] = useState(gsapCode);
  const [resetKey, setResetKey] = useState(Math.random());

  update = () => {
    setResetKey(Math.random());
  };
  return (
    <>
      <CodeText>
        <StepTitle>(Gsap) animations</StepTitle>
        <p className="my-p">
          For simple animations like moving the camera from its current position
          to another, we will use GSAP. For more information you can go to the
          gsaps{" "}
          <a
            className="text-accent underline"
            target="_blank"
            href="https://greensock.com/get-started/"
          >
            get started
          </a>{" "}
          page or{" "}
          <a
            className="text-accent underline"
            target="_blank"
            href="https://greensock.com/docs/v3/Installation"
          >
            installation guide.
          </a>{" "}
          GSAP can animate anything that JavaScript can interact with, including
          Three.js objects and cameras. This makes animating the camera
          incredibly easy.
        </p>
        <p>
          Using GSAP, you can animate your camera from its current position to a
          target position with a smooth and visually pleasing ease. Like this::
        </p>
        <CodeBlockInline>{`gsap.to(camera.position, {
  ...new THREE.Vector2(position.x, position.y),
  duration: 1,
  ease: "power1.out",
});`}</CodeBlockInline>
        <p className="mt-p">
          You can see the result of animating the camera to move in front of the
          clicked cube in the right panel.
        </p>
        <p>
          To emphasize how beneficial GSAP is for your Three.js animations, I've
          provided the same functionality without GSAP. However, it has worse
          performance, a less appealing user experience, doesn't work with
          colors, requires more code, and is harder to read compared to using
          GSAP.
        </p>
        <div className="relative w-fit my-p">
          <button
            className="w-28 relative z-10"
            onClick={() => {
              setResetCanvasKey(Math.random());
              if (renderer) {
                renderer.dispose();
                renderer.forceContextLoss();
              }
              setShowCode(gsapCode);
            }}
          >
            With gsap
          </button>
          <button
            className="py-2 w-28 relative z-10"
            onClick={() => {
              setResetCanvasKey(Math.random());
              if (renderer) {
                renderer.dispose();
                renderer.forceContextLoss();
              }
              setShowCode(noGsapCode);
            }}
          >
            Without gsap
          </button>
          <div
            className="absolute transition-all duration-700 bg-backgroundActive w-1/2 h-full top-0 rounded-md"
            style={{
              left:
                userScript === gsapCode
                  ? "0"
                  : userScript === noGsapCode
                  ? "50%"
                  : "25%",
            }}
          ></div>
        </div>
        <p>
          In summary, I highly recommend using GSAP for your animations in
          Three.js.
        </p>
        <Assignment assignments={assignments}></Assignment>{" "}
      </CodeText>

      <CodeBlock
        showImports={beforeGsapCode}
        code={showCode}
        scrollToLine={50}
      ></CodeBlock>
    </>
  );
};

export default CameraAnimation;
