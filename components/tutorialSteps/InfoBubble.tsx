import React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CodeBlock from "../global/CodeBlock";
import gsap from "gsap";

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
  const loader = new GLTFLoader();

  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    2000000
  );
  camera.position.z = 20;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const light1 = new THREE.DirectionalLight(0xffff99, 2);
  light1.position.x = 5;
  light1.position.z = 5;
  scene.add(light1);

  const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
  scene.add(light2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 7;

  let wheel1: THREE.Object3D<THREE.Event> | null | undefined = null;
  let info: THREE.Object3D<THREE.Event> | null | undefined = null;

  loader.load(
    "scenes/Car2.glb",
    // called when the resource is loaded
    async function (gltf) {
      console.log("loaded");
      scene.add(gltf.scenes[0]);
      wheel1 = gltf.scenes[0].getObjectByName("Wheel1");
      info = gltf.scenes[1].getObjectByName("Info");
      if (info) scene.add(info);
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

  addEventListener("resize", function () {
    renderer.setSize(
      canvas.parentElement!.clientWidth,
      canvas.clientHeight,
      true
    );
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  function animateTo(item: gsap.TweenTarget, to: gsap.TweenVars) {
    return gsap.to(item, {
      ...to,
      duration: 1,
      ease: "power1.out",
    });
  }

  let infoIsHidden = false;
  function toggleInfo(show: boolean) {
    if (!info || (show && !infoIsHidden) || (!show && infoIsHidden)) return;
    infoIsHidden = !show;
    if (show) scene.add(info);
    info.children.forEach((child: any) => {
      child.material.transparent = true;
      animateTo(child.material, { opacity: show ? 1 : 0 }).eventCallback(
        "onComplete",
        () => {
          if (info && infoIsHidden && !show) scene.remove(info);
        }
      );
    });
  }

  let intersectInfo: boolean;
  let oldCameraPosAndQua: {
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
  } | null = null;

  function backClick(backButton: HTMLElement) {
    if (!oldCameraPosAndQua || !info) return;
    animateTo(camera.position, oldCameraPosAndQua.position);
    animateTo(camera.quaternion, oldCameraPosAndQua.quaternion);
    animateTo(backButton.parentElement!.style, {
      display: "none",
      opacity: 0,
    }).eventCallback("onComplete", () => {
      controls.enabled = true;
    });
    toggleInfo(true);

    backButton.removeEventListener("click", function () {
      backClick(backButton);
    });
  }

  function infoClick() {
    if (!wheel1 || !info || !intersectInfo || infoIsHidden) return;

    oldCameraPosAndQua = {
      position: camera.position.clone(),
      quaternion: camera.quaternion.clone(),
    };

    controls.enabled = false;
    animateTo(
      camera.position,
      new THREE.Vector3(
        wheel1.position.x,
        wheel1.position.y,
        wheel1.position.z + 5
      )
    );

    animateTo(camera.quaternion, new THREE.Vector3());

    toggleInfo(false);

    const backButton = document.getElementById("backButton");
    if (backButton) {
      animateTo(backButton.parentElement!.style, {
        display: "flex",
        opacity: 1,
      });

      backButton.addEventListener("click", function () {
        backClick(backButton);
      });
    }
  }
  canvas.addEventListener("click", infoClick);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onPointerMove(event: { clientX: number; clientY: number }) {
    if (!canvas) return;
    const restHeight = window.innerHeight - canvas.clientHeight;
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY - restHeight) / canvas.clientHeight) * 2 + 1;

    if (controls.enabled) {
      const horAngle = controls.getAzimuthalAngle();
      const verAngle = controls.getPolarAngle();
      toggleInfo((-1.4 < horAngle && horAngle < 1.5) || verAngle < 0.6);
    }
  }

  canvas.addEventListener("mousemove", onPointerMove);

  function infoPos(objectPos: number, cameraPos: number) {
    return objectPos + (cameraPos - objectPos) / 1.1;
  }

  function animate() {
    raycaster.setFromCamera(pointer, camera);

    if (info) intersectInfo = !!raycaster.intersectObject(info).length;

    if (wheel1 && info) {
      info.position.set(
        infoPos(wheel1.position.x, camera.position.x),
        infoPos(wheel1.position.y, camera.position.y),
        infoPos(wheel1.position.z, camera.position.z)
      );
      info.lookAt(camera.position);
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  if (userScript === null) animate();
};

const InfoBubble: React.FC = () => {
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

export default InfoBubble;
