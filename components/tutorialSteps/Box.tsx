import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import { Object3D } from "three";
import userFunction from "../../helpers/userFunction";
import CodeBlock from "../global/CodeBlock";
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

export const boxSceneFunction = (userScript: string) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = 30;
  const canvas = document.getElementById("canvas");

  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // const geometry = new THREE.BoxGeometry(10, 10, 10);
  // const material = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  const cube = userFunction(
    `const geometry = new THREE.BoxGeometry(10, 10, 10);
    
  const material = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  return cube;
  `,
    "",
    "",
    ["THREE", "scene"],
    [THREE, scene]
  );

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
  if (userScript === null) animate();
};

const Box: React.FC<InputProps> = () => {
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

export default Box;
