import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CodeBlockNoInput from "../global/CodeBlockNoInput";

const code = `const canvas = document.getElementById("canvas");
const loader = new GLTFLoader();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x000000, 0);

const light1 = new THREE.DirectionalLight(0xffff99, 3);
light1.position.x = 50;
light1.position.z = 5;

scene.add(light1);
const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
scene.add(light2);

window.addEventListener("resize", function () {
  renderer.setSize(
    canvas.parentElement!.clientWidth,
    canvas.parentElement!.clientHeight,
    true
  );
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
});

loader.load(
  // resource URL
  // "https://raw.githubusercontent.com/Websitebystudents/pim-pom/main/model/pim_pom_clubhuis_8.gltf"
  // "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedCube/glTF/AnimatedCube.gltf",
  // "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF/BrainStem.gltf",
  // "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/Sponza.gltf",
  "scenes/avocado.gltf",
  // called when the resource is loaded
  async function (gltf) {
    console.log("loaded");
    scene.add(gltf.scene);
  },
  // called while loading is progressing
  function (xhr) {
    if (xhr.total) console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log(error);
  }
);
const radius = 500;
let theta = 0;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  theta += 0.2;
  camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
  camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
  camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
  camera.lookAt(scene.position);
}
if (userScript === null) animate();`;

export const spinSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");
  const loader = new GLTFLoader();
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    2000000
  );

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const light1 = new THREE.DirectionalLight(0xffff99, 3);
  light1.position.x = 50;
  light1.position.z = 5;

  scene.add(light1);
  const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
  scene.add(light2);

  window.addEventListener("resize", function () {
    renderer.setSize(
      canvas.parentElement!.clientWidth,
      canvas.parentElement!.clientHeight,
      true
    );
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  loader.load(
    // resource URL
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF/BrainStem.gltf",
    // called when the resource is loaded
    async function (gltf) {
      console.log("loaded");
      scene.add(gltf.scene);
    },
    // called while loading is progressing
    function (xhr) {
      if (xhr.total) console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log(error);
    }
  );
  const radius = 5;
  let theta = 0;
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    theta += 0.2;
    camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
    camera.lookAt(scene.position);
  }
  if (userScript === null) animate();
};

const Spin: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <h2>Code block for spinning around a object</h2>
      <CodeBlockNoInput>{code}</CodeBlockNoInput>
    </div>
  );
};

export default Spin;
