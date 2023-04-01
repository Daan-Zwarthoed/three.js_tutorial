import React from "react";
import * as THREE from "three";
import userFunction from "../../helpers/userFunction";
import CodeBlock from "../global/CodeBlock";

const showBefore = `const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
`;

const inputValue = "renderer.setSize();";

const showAfter = `
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}`;

export const rendererSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");

  if (!canvas) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    2000
  );
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  window.addEventListener("resize", function () {
    renderer.setSize(
      canvas.parentElement!.clientWidth,
      canvas.clientHeight,
      true
    );
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  userFunction(userScript, ["renderer"], [renderer]);

  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
  if (userScript === null) animate();
};

const Renderer: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <h2>What do you need before starting this three.js adventure?</h2>
      <CodeBlock
        showBefore={showBefore}
        showAfter={showAfter}
        inputValue={inputValue}
      ></CodeBlock>
    </div>
  );
};

export default Renderer;
