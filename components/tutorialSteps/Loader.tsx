import React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CodeBlock from "../global/CodeBlock";
import userFunction from "../../helpers/userFunction";

const showBefore = `const canvas = document.getElementById("canvas");
const loader = new GLTFLoader();
let mixer: THREE.AnimationMixer | null = null;
let clock = new THREE.Clock();
if (!canvas) return;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);

const light1 = new THREE.DirectionalLight(0xffff99, 2);
light1.position.x = 5;
light1.position.z = 5;

scene.add(light1);
const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
scene.add(light2);

new OrbitControls(camera, renderer.domElement);

loader.load(`;

const showAfter = ` // called when the resource is loaded
  async function (gltf) {
    console.log("loaded");
    scene.add(gltf.scene);

    mixer = new THREE.AnimationMixer(gltf.scene);

    gltf.animations.forEach((clip) => {
      if (mixer) mixer.clipAction(clip).play();
    });
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

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
}
animate();`;

export const loaderSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");
  const loader = new GLTFLoader();
  let mixer: THREE.AnimationMixer | null = null;
  let clock = new THREE.Clock();
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    2000000
  );
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x01e3d59, 1);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffff99, 1);
  directionalLight.position.set(30, 17, 26);
  scene.add(directionalLight);
  new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", function () {
    renderer.setSize(
      canvas.parentElement!.clientWidth,
      canvas.parentElement!.clientHeight,
      true
    );
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  if (userScript)
    loader.load(
      // resource URL
      // "https://raw.githubusercontent.com/Websitebystudents/pim-pom/main/model/pim_pom_clubhuis_8.gltf"
      // "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedCube/glTF/AnimatedCube.gltf",
      // "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF/BrainStem.gltf",
      // "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/Sponza.gltf",
      userScript.replace(/[""]/g, ""),
      // called when the resource is loaded
      async function (gltf) {
        console.log("loaded");
        scene.add(gltf.scene);

        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          if (mixer) mixer.clipAction(clip).play();
        });

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
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

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
  }
  animate();
};

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <p>Fill in any of these in the green box:</p>
      <pre className="select-all">{`"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedCube/glTF/AnimatedCube.gltf"`}</pre>
      <pre className="select-all">{`"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF/BrainStem.gltf"`}</pre>
      <pre className="select-all">{`"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ABeautifulGame/glTF/ABeautifulGame.gltf"`}</pre>
      <CodeBlock
        showBefore={showBefore}
        showAfter={showAfter}
        inputHeight={1}
      ></CodeBlock>
    </div>
  );
};

export default Loader;
