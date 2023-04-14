import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import userFunction from "../../helpers/userFunction";
import CodeBlock from "../code/CodeBlock";
import CodeBlockInline from "../code/CodeBlockInline";
import CodeBlockNoInput from "../code/CodeBlockNoInput";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CodeText from "../tutorialHelpers/CodeText";
import AppContext from "../../contexts/AppContextProvider";

const code = `import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById("canvas");

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
renderer.setClearColor(0x01e3d59, 1);

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({
  color: "#d63e4d",
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
`;
export const addonsSceneFunction = (userScript: string) => {
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
  renderer.setClearColor(0x01e3d59, 1);

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
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: "#d63e4d",
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  new OrbitControls(camera, renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
};

const Addons: React.FC = () => {
  return (
    <>
      <CodeText>
        <h2>Add your own Addons to the scene</h2>
        <p>
          Three.js by itself contains all the fundementals of a 3D engine. Other
          Three.js components like controls, loaders and post-processing need to
          be imported seperatly from the addons/ directory. Note that you don't
          need to install them seperatly just import them seperatly.
        </p>
        <p>Importing controls will in most cases look like this:</p>
        <CodeBlockInline>
          {`import { OrbitControls } from 'three/addons/controls/OrbitControls.js';`}
        </CodeBlockInline>
        <p>Using typescript it will look like this:</p>
        <CodeBlockInline>
          {`import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";`}
        </CodeBlockInline>
      </CodeText>

      <CodeBlockNoInput>{code}</CodeBlockNoInput>
    </>
  );
};

export default Addons;
