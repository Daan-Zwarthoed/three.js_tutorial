import React from "react";
import * as THREE from "three";
import userFunction from "../../helpers/userFunction";
import CodeBlock from "../global/CodeBlock";

const showBefore = `const canvas = document.getElementById("canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);
`;

const showAfter = `
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}
animate();`;
let id: number;
export const boxSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");

  if (!canvas) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    2000
  );

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x01e3d59, 1);

  window.addEventListener("resize", function () {
    renderer.setSize(
      canvas.parentElement!.clientWidth,
      canvas.clientHeight,
      true
    );
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });
  // const geometry = new THREE.BoxGeometry(10, 10, 10);
  // const material = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
  // const cube = new THREE.Mesh(geometry, material);
  // cube.position.z = -30;
  // scene.add(cube);
  const cube = userFunction(
    userScript,
    "cube",
    ["THREE", "scene"],
    [THREE, scene]
  );

  if (id) cancelAnimationFrame(id);

  function animate() {
    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
    id = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
};

const Box: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
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
