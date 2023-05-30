import React, { useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CodeBlock from "../code/CodeBlock";
import userFunction from "../../helpers/userFunction";
import CodeBlockInline from "../code/CodeBlockInline";
import CodeText from "../tutorialHelpers/CodeText";
import Assignment from "../tutorialHelpers/Assignment";
import StepTitle from "../tutorialHelpers/StepTitle";
import Note from "../tutorialHelpers/Note";

const showImports = `import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls";
`;
const code = `// Basic setup
const canvas = document.getElementById("canvas");

const loader = new GLTFLoader();
const clock = new THREE.Clock();
let mixer = null;

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
const directionalLight = new THREE.DirectionalLight(0xffff99, 2);
directionalLight.position.set(5, 5, 10);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Controls
new OrbitControls(camera, renderer.domElement);

// Loader
loader.load(
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF/BrainStem.gltf",
  // called when the resource is loaded
  function (gltf) {
    console.log("loaded");

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
animate();
`;

let checkInterval: number | NodeJS.Timer | undefined;
export const loaderSceneFunction = (userScript: string) => {
  const scene = userFunction(
    userScript,
    ["THREE", "GLTFLoader", "OrbitControls"],
    [THREE, GLTFLoader, OrbitControls],
    "scene"
  );
  clearInterval(checkInterval as number);
  checkInterval = setInterval(() => {
    assignmentCheck(scene);
  }, 1000);
};

const assignments = {
  addGLTF: {
    title: "Add the scene obtained from the loaded GLTF to your own scene.",
    hint: "The 'gltf' object has a 'scene' property that you can add to your scene, just like any other object or light.",
    checked: false,
  },
};

const assignmentCheck = (scene: THREE.Scene) => {
  // Check for third child since there are 2 lights
  if (!scene || !scene.children[2]) return;
  clearInterval(checkInterval as number);
  const gltfScene = scene.children[2];
  // Check if it is group to make it harder to cheat
  if (gltfScene.type !== "Group") return;
  const assignmentsClone = JSON.parse(JSON.stringify(assignments));
  assignments.addGLTF.checked = true;

  if (assignmentsClone.addGLTF.checked !== assignments.addGLTF.checked)
    update();
};

let update: () => void;

const Loader: React.FC = () => {
  const [resetKey, setResetKey] = useState(Math.random());

  update = () => {
    setResetKey(Math.random());
  };
  return (
    <>
      <CodeText>
        <StepTitle>GLTF loader and animations</StepTitle>
        <h3 className="mt-p">GLTF Loader</h3>
        <p>
          To import a 3D design into Three.js, there are many accepted file
          types. However, the most common and recommended way, in 99% of cases,
          is to use GLTF. GLTF loads the fastest and is overall the
          best-optimized option.
        </p>
        <p className="mt-p">
          You can import the GLTFLoader in the same way we imported the
          controls.
        </p>
        <CodeBlockInline>
          {`import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';`}
        </CodeBlockInline>
        <p className="mt-p">
          On line 38, we begin loading our GLTF file. 'loader.load' takes four
          arguments.
        </p>
        <ul className="my-ol">
          <li className="my-li">
            First, you need to provide the <strong>URL</strong> of the file you
            want to import. Similar to an image, you can import it from your
            project directly or import it from an online source. In this
            example, we will import a GLTF file from the{" "}
            <a
              href="https://github.com/KhronosGroup/glTF-Sample-Models"
              className="underline text-accent"
            >
              Khronos Group
            </a>
            , which offers a variety of GLTF sample models to play around with.
          </li>
          <li className="my-li">
            The second argument is a function that is called when the file is{" "}
            <strong>loaded</strong>. It receives a 'gltf' parameter, which
            contains the animations, cameras, asset information, scene, and
            scenes.
          </li>
          <li className="my-li">
            The next argument is a function that is called while the file is
            being <strong>loaded</strong>. It has 'loaded' and 'total' values as
            parameters.
          </li>
          <li className="my-li">
            The last argument is a function that is called if there is an{" "}
            <strong>error</strong> during loading.
          </li>
        </ul>
        <Note>
          The 'loaded' and 'total' values used while loading are very inaccurate
          when using GLTF and/or React, so it is not advised to display them to
          the user.
        </Note>
        <h3 className="mt-p">GLTF Animations</h3>
        <p>
          After loading the file we automatically play its animations. We
          achieve this by creating an animation mixer and then starting all the
          animations in the scene. The animations actually play because we
          update our mixer with a delta value obtained from the clock.
        </p>
        <p className="mt-5">That will look like this:</p>
        <CodeBlockInline>
          {`const delta = clock.getDelta();
if (mixer) mixer.update(delta);`}
        </CodeBlockInline>
        <Assignment assignments={assignments}></Assignment>{" "}
      </CodeText>
      <CodeBlock
        showImports={showImports}
        code={code}
        scrollToLine={37}
      ></CodeBlock>
    </>
  );
};

export default Loader;
