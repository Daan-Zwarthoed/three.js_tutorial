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
    title: "Add the scene gotten from the loaded gltf to your own scene.",
    hint: "gltf has the property you can add to your scene like any other object or light.",
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
        <h3 className="mt-8">GLTF Loader</h3>
        <p>
          Too import a 3D design into Three.js there are alot of accepted file
          types. The most common and in 99% of cases the best way to import 3D
          designs is by GLTF. GLTF loads the fastest and is overall the best
          optimized option.
        </p>
        <p className="mt-8">
          You can import the GLTFLoader in the same way we did the controls.
        </p>
        <CodeBlockInline>
          {`import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';`}
        </CodeBlockInline>
        <p className="mt-8">
          On line 37 we start loading our gltf file. loader.load takes 4
          arguments.
        </p>
        <ul className="my-5">
          <li className="my-3">
            First up is the <strong>URL</strong> you want to import. Just like
            an image you can directly import from you project or import one
            online. Right now we will be importing one from the{" "}
            <a
              href="https://github.com/KhronosGroup/glTF-Sample-Models"
              className="underline text-primary"
            >
              KhronosGroup
            </a>
            . They have a great amount of gltf sample modules you can play
            around with.
          </li>
          <li className="my-3">
            Next up is a function called when the file is{" "}
            <strong>loaded</strong>. It has a parameter object of gltf
            containing the animations, cameras, asset, scene and scenes.
          </li>
          <li className="my-3">
            The next function is called while <strong>loading</strong>. Its
            paramater has a loaded and total value.
          </li>
          <li className="my-3">
            The last function is called if the loading has an{" "}
            <strong>error</strong>.
          </li>
        </ul>
        <Note>
          The loaded and total value is VERY inacurrate when using gltf and/or
          React. So displaying this to the user is not advised.
        </Note>
        <h3 className="mt-8">GLTF Animations</h3>
        <p>
          As you can see adding a link to the loader will load that file and
          automatically play its animations. We do this by creating an animation
          mixer and then starting all the animations in the scene. The
          animations actually play because we update our mixer with a delta
          gotten from the clock.
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
