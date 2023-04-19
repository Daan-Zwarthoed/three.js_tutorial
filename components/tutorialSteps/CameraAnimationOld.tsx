import React from "react";
import * as THREE from "three";
import { Range } from "ace-builds";
import CodeBlockNoInput from "../code/CodeBlockNoInput";
import CodeText from "../tutorialHelpers/CodeText";

const code = `import * as THREE from "three";

const canvas = document.getElementById("canvas");
const raycaster = new THREE.Raycaster();

if (!canvas) return;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000000
);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
scene.add(light2);

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

const pointer = new THREE.Vector2();

function onPointerMove(event: { clientX: number; clientY: number }) {
  if (!canvas) return;
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;
}
canvas.addEventListener("mousemove", onPointerMove);

let intersect: THREE.Object3D<THREE.Event> | null;
let cameraPositionGoal: THREE.Vector2 | null = null;
let animationDistance: THREE.Vector2 | null = null;

function onClick() {
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

function animateCamera() {
  if (!cameraPositionGoal || !animationDistance) return;
  if (
    camera.position.x.toFixed(5) === cameraPositionGoal.x.toFixed(5) &&
    camera.position.y.toFixed(5) === cameraPositionGoal.y.toFixed(5)
  )
    return (cameraPositionGoal = null);
  camera.position.x += animationDistance.x;
  camera.position.y += animationDistance.y;;
}

function animate() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  intersect = intersects[0] && intersects[0].object;

  animateCamera();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;

export const cameraAnimationOldSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");
  const raycaster = new THREE.Raycaster();

  if (!canvas) return;

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

  const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
  scene.add(light2);

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

  window.addEventListener("resize", function () {
    if (!canvas.parentElement) return;
    renderer.setSize(
      canvas.parentElement.clientWidth,
      canvas.parentElement.clientHeight,
      true
    );
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  const pointer = new THREE.Vector2();

  function onPointerMove(event: { clientX: number; clientY: number }) {
    if (!canvas) return;
    const canvasLeft = canvas.getBoundingClientRect().left;
    const canvasTop = canvas.getBoundingClientRect().top;
    pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
    pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;
  }
  canvas.addEventListener("mousemove", onPointerMove);

  let intersect: THREE.Object3D<THREE.Event> | null;
  let cameraPositionGoal: THREE.Vector2 | null = null;
  let animationDistance: THREE.Vector2 | null = null;

  function onClick() {
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

  function animate() {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    intersect = intersects[0] && intersects[0].object;

    animateCamera();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
};
const CameraAnimationOld: React.FC = () => {
  return (
    <>
      <CodeText>
        <h2>Code block for bad camera animation</h2>
        <p>
          To nail the hammer home what a gift gsap is for your Three.js
          animations I made the same functionality as in the last step but
          without gsap.
        </p>
        <p>
          It has worse performance, looks worse for the user, doesn't even work
          for colors, takes more code and is way harder to read then gsap.
        </p>
        <p>Long story short. Just use gsap.</p>
      </CodeText>
      <CodeBlockNoInput highlightArea={{ startRow: 50, endRow: 101 }}>
        {code}
      </CodeBlockNoInput>
    </>
  );
};

export default CameraAnimationOld;
