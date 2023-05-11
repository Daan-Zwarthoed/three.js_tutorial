import React, { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import CodeBlock from "../code/CodeBlock";
import CodeBlockNoInput from "../code/CodeBlockNoInput";
import CodeBlockInline from "../code/CodeBlockInline";
import Link from "next/link";
import CodeText from "../tutorialHelpers/CodeText";
import userFunction from "../../helpers/userFunction";
import AppContext from "../../contexts/AppContextProvider";

const beforeGsapCode = `import * as THREE from "three";
import gsap from "gsap";
`;

const gsapCode = `
// Basic setup
const canvas = document.getElementById("canvas");
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000000
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

// Raycaster setup
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  if (!canvas) return;
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;
}
canvas.addEventListener("mousemove", onPointerMove);

// Animate on click
function onClick() {
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
animate();`;

const noGsapCode = `
// Basic setup
const canvas = document.getElementById("canvas");
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000000
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

// Raycaster setup
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  if (!canvas) return;
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;
}
canvas.addEventListener("mousemove", onPointerMove);

// Set animation goal on click
let cameraPositionGoal;
let animationDistance;

function onClick() {
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
animate();`;
let renderer: THREE.WebGLRenderer | undefined;

export const cameraAnimationSceneFunction = (userScript: string) => {
  userFunction(userScript, ["THREE", "gsap"], [THREE, gsap], "renderer");
};

const CameraAnimation: React.FC = () => {
  const { userScript, setUserScript, setResetCanvasKey } =
    useContext(AppContext);
  useEffect(() => {
    setUserScript(gsapCode);
  }, []);
  return (
    <>
      <CodeText>
        <h2>Code block for camera animation</h2>
        <p>
          For simple animations like moving the camera from its current position
          to another we will use gsap. Here is a link to the{" "}
          <a
            className="text-blue-500 underline"
            target="_blank"
            href="https://greensock.com/get-started/"
          >
            get started
          </a>{" "}
          page and its{" "}
          <a
            className="text-blue-500 underline"
            target="_blank"
            href="https://greensock.com/docs/v3/Installation"
          >
            installation guide.
          </a>{" "}
          . Gsap can animate anything that javascript can touch. Including
          Three.js objects and camera's. This makes animating the camera
          incredibly easy.
        </p>
        <CodeBlockInline>{`gsap.to(camera.position, {
  ...new THREE.Vector2(position.x, position.y),
  duration: 1,
  ease: "power1.out",
});`}</CodeBlockInline>
        <p>
          Just this code will animate your camera from its current position to
          one you selected
        </p>
        <p>
          On the right you will be able to see what animating the camera to move
          infront of the clicked cube would look like.
        </p>
        <p>
          To nail the hammer home what a gift gsap is for your Three.js
          animations I made the same functionality as in the last step but
          without gsap.
        </p>
        <div className="relative w-fit my-2">
          <button
            className="py-2 w-10 relative z-10"
            onClick={() => {
              setResetCanvasKey(Math.random());
              if (renderer) {
                renderer.dispose();
                renderer.forceContextLoss();
              }
              setUserScript(gsapCode);
            }}
          >
            New
          </button>
          <button
            className="py-2 w-10 relative z-10"
            onClick={() => {
              setResetCanvasKey(Math.random());
              if (renderer) {
                renderer.dispose();
                renderer.forceContextLoss();
              }
              setUserScript(noGsapCode);
            }}
          >
            Old
          </button>
          <div
            className="absolute transition-all duration-700 bg-tertary w-1/2 h-full top-0"
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
          It has worse performance, looks worse for the user, doesn't even work
          for colors, takes more code and is way harder to read then gsap.
        </p>
        <p>Long story short. Just use gsap.</p>
      </CodeText>

      <CodeBlock
        showBefore={beforeGsapCode}
        inputValue={userScript}
        showAfter={""}
      ></CodeBlock>
    </>
  );
};

export default CameraAnimation;
