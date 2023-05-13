import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CodeBlock from "../code/CodeBlock";
import userFunction from "../../helpers/userFunction";
import CodeBlockInline from "../code/CodeBlockInline";
import CodeText from "../tutorialHelpers/CodeText";
import AppContext from "../../contexts/AppContextProvider";

const showImports = `
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls";
`;
const code = `// Basic setup
const canvas = document.getElementById("canvas");
const loader = new GLTFLoader();
let mixer = null;
let clock = new THREE.Clock();

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

// Lights
const light1 = new THREE.DirectionalLight(0xffff99, 2);
light1.position.x = 5;
light1.position.z = 5;
scene.add(light1);

const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
scene.add(light2);

new OrbitControls(camera, renderer.domElement);

// Loader
loader.load( 
  
// called when the resource is loaded
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

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
}
animate();`;

export const loaderSceneFunction = (userScript: string) => {
  userFunction(
    userScript,
    ["THREE", "GLTFLoader", "OrbitControls"],
    [THREE, GLTFLoader, OrbitControls]
  );
};

const Loader: React.FC = () => {
  return (
    <>
      <CodeText>
        <h2>GLTF loader and GLTF animations</h2>
        <h3>GLTF Loader</h3>
        <p>
          Too import a 3D design into Three.js there are alot of accepted file
          types. The most common and in 99% of cases the best way to import 3D
          designs is by GLTF. GLTF loads the fastest and is overall the best
          optimized option.
        </p>
        <p>
          You can import the GLTFLoader in the same way we did the controls.
        </p>
        <CodeBlockInline>
          {`import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';`}
        </CodeBlockInline>

        <p>Fill in any of these at line 38:</p>
        <CodeBlockInline>
          {`"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedCube/glTF/AnimatedCube.gltf",
"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF/BrainStem.gltf",
"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF/CesiumMan.gltf",`}
        </CodeBlockInline>
        <h3>GLTF Animations</h3>
        <p>
          As you can see adding a link to the loader will load that file and
          automatically play its animations. We do this by creating an animation
          mixer and then starting all the animations in the scene. The
          animations actually play because we update our mixer with a delta
          gotten from the clock.
        </p>
        <CodeBlockInline>
          {`const delta = clock.getDelta();
if (mixer) mixer.update(delta);`}
        </CodeBlockInline>
      </CodeText>
      <CodeBlock
        showImports={showImports}
        code={code}
        highlightArea={{ startRow: 38, endRow: 38 }}
      ></CodeBlock>
    </>
  );
};

export default Loader;
