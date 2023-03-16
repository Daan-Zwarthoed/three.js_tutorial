import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

import CodeBlock from "../global/CodeBlock";
const loader = new GLTFLoader();
type InputProps = {
  renderer?: any;
  cameraType?: THREE.PerspectiveCamera;
  animation?: any;
};

const showBefore = `const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);`;

const showAfter = `function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}
animate();`;

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
  camera.position.z = 20;

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

  function onPointerMove(event: { clientX: number; clientY: number }) {
    if (!canvas) return;
    const restHeight = window.innerHeight - canvas.clientHeight;
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY - restHeight) / canvas.clientHeight) * 2 + 1;
  }
  canvas.addEventListener("mousemove", onPointerMove);
  let INTERSECTED: THREE.Object3D<THREE.Event> | null = null;
  let INTERSECTEDCOLOR: null = null;

  function animate() {
    if (canvas) renderer.setSize(canvas.clientWidth, canvas.clientHeight);
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

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  if (userScript === null) animate();
};
const Raycaster: React.FC<InputProps> = () => {
  return (
    <div className="flex flex-col">
      <h2>What do you need before starting this three.js adventure?</h2>
      <CodeBlock
        showBefore={showBefore}
        showAfter={showAfter}
        inputHeight={5}
      ></CodeBlock>
    </div>
  );
};

export default Raycaster;
