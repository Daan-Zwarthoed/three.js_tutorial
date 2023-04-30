import React from "react";
import * as THREE from "three";
import gsap from "gsap";
import CodeBlock from "../code/CodeBlock";
import CodeBlockNoInput from "../code/CodeBlockNoInput";
import CodeBlockInline from "../code/CodeBlockInline";
import Link from "next/link";
import CodeText from "../tutorialHelpers/CodeText";

const code = `import * as THREE from "three";
import gsap from "gsap";

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

let intersect;

function onClick() {
  if (!intersect) return;
  gsap.to(camera.position, {
    ...new THREE.Vector2(intersect.position.x, intersect.position.y),
    duration: 1,
    ease: "power1.out",
  });
}
canvas.addEventListener("click", onClick);

function animate() {
  if (canvas) renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  intersect = intersects[0] && intersects[0].object;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;
export const cameraAnimationSceneFunction = (userScript: string) => {
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

  function onClick() {
    if (!intersect) return;
    gsap.to(camera.position, {
      ...new THREE.Vector2(intersect.position.x, intersect.position.y),
      duration: 1,
      ease: "power1.out",
    });
  }
  canvas.addEventListener("click", onClick);

  function animate() {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    intersect = intersects[0] && intersects[0].object;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
};
const CameraAnimation: React.FC = () => {
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
      </CodeText>

      <CodeBlockNoInput>{code}</CodeBlockNoInput>
    </>
  );
};

export default CameraAnimation;
