import React from "react";
import * as THREE from "three";

import CodeBlockNoInput from "../code/CodeBlockNoInput";
import CodeText from "../tutorialHelpers/CodeText";
import CodeBlockInline from "../code/CodeBlockInline";

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
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;
}

canvas.addEventListener("mousemove", onPointerMove);

let INTERSECTED = null;
let INTERSECTEDCOLOR = null;

function animate() {
  if (canvas) renderer.setSize(canvas.clientWidth, canvas.clientHeight);
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
    const canvasLeft = canvas.getBoundingClientRect().left;
    const canvasTop = canvas.getBoundingClientRect().top;
    pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
    pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;
  }

  canvas.addEventListener("mousemove", onPointerMove);

  let INTERSECTED: THREE.Object3D<THREE.Event> | null = null;
  let INTERSECTEDCOLOR: null = null;
  if (id) cancelAnimationFrame(id);

  function animate() {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    const intersect = intersects[0] && intersects[0].object;

    if (intersect) {
      if (intersect !== INTERSECTED) {
        if (INTERSECTED)
          (INTERSECTED as any).material.color.set(INTERSECTEDCOLOR);
        INTERSECTED = intersect;
        INTERSECTEDCOLOR = (intersect as any).material.color.clone();
        (intersect as any).material.color.set(0xff0000);
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
      </CodeText>
      <CodeBlockNoInput highlightArea={{ startRow: 30, endRow: 67 }}>
        {code}
      </CodeBlockNoInput>
    </>
  );
};

export default Raycaster;
