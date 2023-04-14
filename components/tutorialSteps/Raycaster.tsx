import React from "react";
import * as THREE from "three";

import CodeBlockNoInput from "../code/CodeBlockNoInput";
import CodeText from "../tutorialHelpers/CodeText";

const code = `import * as THREE from "three";

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

const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
scene.add(light2);

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
const cube = new THREE.Mesh(geometry, material);
cube.position.x = -7;

const material2 = new THREE.MeshBasicMaterial({ color: "#ffff99" });
const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.x = 7;

scene.add(cube);
scene.add(cube2);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  const restWidth = window.innerWidth - canvas.clientWidth;
  const restHeight = window.innerHeight - canvas.clientHeight;
  pointer.x = ((event.clientX - restWidth) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - restHeight) / canvas.clientHeight) * 2 + 1;
}

canvas.addEventListener("mousemove", onPointerMove);

let INTERSECTED = null;
let INTERSECTEDCOLOR = null;

function animate() {
  if (canvas) renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  const intersect = intersects[0];

  if (intersect) {
    if (intersect.object !== INTERSECTED) {
      if (INTERSECTED) INTERSECTED.material.color.set(INTERSECTEDCOLOR);
      INTERSECTED = intersect.object;
      INTERSECTEDCOLOR = intersect.object.material.color.clone();
      intersect.object.material.color.set(0xff0000);
    }
  } else if (INTERSECTED) {
    INTERSECTED.material.color.set(INTERSECTEDCOLOR);
    INTERSECTED = null;
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;
let id: number;
export const raycasterSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");

  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    70,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    2000000
  );
  camera.position.z = 40;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x01e3d59, 1);

  const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
  scene.add(light2);

  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = -7;

  const material2 = new THREE.MeshBasicMaterial({ color: "#ffff99" });
  const cube2 = new THREE.Mesh(geometry, material2);
  cube2.position.x = 7;

  scene.add(cube);
  scene.add(cube2);

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

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onPointerMove(event: { clientX: number; clientY: number }) {
    if (!canvas) return;
    const restWidth = window.innerWidth - canvas.clientWidth;
    const restHeight = window.innerHeight - canvas.clientHeight;
    pointer.x = ((event.clientX - restWidth) / canvas.clientWidth) * 2 - 1;
    pointer.y = -((event.clientY - restHeight) / canvas.clientHeight) * 2 + 1;
  }

  canvas.addEventListener("mousemove", onPointerMove);

  let INTERSECTED: THREE.Object3D<THREE.Event> | null = null;
  let INTERSECTEDCOLOR: null = null;
  if (id) cancelAnimationFrame(id);

  function animate() {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    const intersect = intersects[0];

    if (intersect) {
      if (intersect.object !== INTERSECTED) {
        if (INTERSECTED)
          (INTERSECTED as any).material.color.set(INTERSECTEDCOLOR);
        INTERSECTED = intersect.object;
        INTERSECTEDCOLOR = (intersect.object as any).material.color.clone();
        (intersect.object as any).material.color.set(0xff0000);
      }
    } else if (INTERSECTED) {
      (INTERSECTED as any).material.color.set(INTERSECTEDCOLOR);
      INTERSECTED = null;
    }

    id = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
};
const Raycaster: React.FC = () => {
  return (
    <>
      <CodeText>
        <h2>Code block for raycasters</h2>
      </CodeText>
      <CodeBlockNoInput>{code}</CodeBlockNoInput>
    </>
  );
};

export default Raycaster;
