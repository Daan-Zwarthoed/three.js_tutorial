import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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

export const infoBubbleSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");
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
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const light1 = new THREE.DirectionalLight(0xffff99, 2);
  light1.position.x = 5;
  light1.position.z = 5;

  scene.add(light1);
  const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
  scene.add(light2);

  new OrbitControls(camera, renderer.domElement);
  loader.load(
    "scenes/car.glb",
    // called when the resource is loaded
    async function (gltf) {
      console.log("loaded");
      scene.add(gltf.scene);
      console.log(gltf.scene);
      const wheels = gltf.scene.getObjectByName("Wheel1");
      console.log(wheels);
      const size = 2;
      //   wheels?.scale.set(size, size, size);
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

  addEventListener("resize", (event) => {
    if (canvas)
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

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
    const intersects = raycaster.intersectObjects(scene.children, true);
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

const InfoBubble: React.FC<InputProps> = () => {
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

export default InfoBubble;
