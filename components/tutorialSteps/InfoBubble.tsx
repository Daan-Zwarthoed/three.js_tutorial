import React, { useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CodeBlock from "../code/CodeBlock";
import gsap from "gsap";
import CodeBlockNoInput from "../code/CodeBlockNoInput";
import CodeText from "../tutorialHelpers/CodeText";
const SubStepTypes = [
  "loader",
  "toggle info",
  "info click",
  "back click",
  "hide info behind car",
  "info button position",
] as const;
type SubStep = (typeof SubStepTypes)[number];
const code = `import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import gsap from "gsap";

// Basic setup
const loader = new GLTFLoader();
const canvas = document.getElementById("canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);

// Add lights
const directionalLight = new THREE.DirectionalLight(0xffff99, 2);
directionalLight.position.x = 5;
directionalLight.position.z = 5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 7;

// Load car
let wheel1 = null;
let info = null;

loader.load(
  "scenes/Car2.glb",
  // called when the resource is loaded
  async function (gltf) {
    console.log("loaded");
    scene.add(gltf.scenes[0]);
    scene.add(gltf.scenes[1]);

    wheel1 = gltf.scenes[0].getObjectByName("Wheel1");
    info = gltf.scenes[1];
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

// Gsap animation
function animateTo(item, to) {
  return gsap.to(item, {
    ...to,
    duration: 1,
    ease: "power1.out",
  });
}

// Toogle info button shown or hidden
let infoIsShown = true;
function toggleInfo(show: boolean) {
  if (!info || (show && infoIsShown) || (!show && !infoIsShown)) return;
  infoIsShown = show;
  if (show) scene.add(info);
  info.children.forEach((child: any) => {
    child.material.transparent = true;
    animateTo(child.material, { opacity: show ? 1 : 0 }).eventCallback(
      "onComplete",
      () => {
        if (info && !infoIsShown && !show) scene.remove(info);
      }
    );
  });
}

let intersectInfo;
let oldCameraPosAndQua = null;

// Zoom into info button
function infoClick() {
  if (!wheel1 || !info || !intersectInfo || !infoIsShown) return;

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

// Zoom back out of info button
function backClick(backButton) {
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

// Raycaster setup
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;

  if (controls.enabled) {
    const horAngle = controls.getAzimuthalAngle();
    const verAngle = controls.getPolarAngle();
    toggleInfo((-1.4 < horAngle && horAngle < 1.5) || verAngle < 0.6);
  }
}

canvas.addEventListener("mousemove", onPointerMove);

// Info positioning formula
function infoPos(wheelPos, cameraPos) {
  return wheelPos + (cameraPos - wheelPos) / 1.1;
}

// Animation loop
function animate() {
  if (wheel1 && info) {
    info.position.set(
      infoPos(wheel1.position.x, camera.position.x),
      infoPos(wheel1.position.y, camera.position.y),
      infoPos(wheel1.position.z, camera.position.z)
    );
    info.lookAt(camera.position);
  }

  raycaster.setFromCamera(pointer, camera);
  if (info) intersectInfo = !!raycaster.intersectObject(info).length;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
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
    2000
  );
  camera.position.z = 20;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x01e3d59, 1);

  const directionalLight = new THREE.DirectionalLight(0xffff99, 2);
  directionalLight.position.x = 5;
  directionalLight.position.z = 5;
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

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
      scene.add(gltf.scenes[1]);

      wheel1 = gltf.scenes[0].getObjectByName("Wheel1");
      info = gltf.scenes[1];
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

  function animateTo(item: gsap.TweenTarget, to: gsap.TweenVars) {
    return gsap.to(item, {
      ...to,
      duration: 1,
      ease: "power1.out",
    });
  }

  let infoIsShown = true;
  function toggleInfo(show: boolean) {
    if (!info || (show && infoIsShown) || (!show && !infoIsShown)) return;
    infoIsShown = show;
    if (show) scene.add(info);
    info.children.forEach((child: any) => {
      child.material.transparent = true;
      animateTo(child.material, { opacity: show ? 1 : 0 }).eventCallback(
        "onComplete",
        () => {
          if (info && !infoIsShown && !show) scene.remove(info);
        }
      );
    });
  }

  let intersectInfo: boolean;
  let oldCameraPosAndQua: {
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
  } | null = null;

  function infoClick() {
    if (!wheel1 || !info || !intersectInfo || !infoIsShown) return;

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
      backButton.addEventListener("click", backClick);
    }
  }

  canvas.addEventListener("click", infoClick);

  function backClick() {
    const backButton = document.getElementById("backButton");
    if (!oldCameraPosAndQua || !info || !backButton) return;
    animateTo(camera.position, oldCameraPosAndQua.position);
    animateTo(camera.quaternion, oldCameraPosAndQua.quaternion);
    animateTo(backButton.parentElement!.style, {
      display: "none",
      opacity: 0,
    }).eventCallback("onComplete", () => {
      controls.enabled = true;
    });
    toggleInfo(true);
    backButton.removeEventListener("click", backClick);
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onPointerMove(event: { clientX: number; clientY: number }) {
    if (!canvas) return;
    const canvasLeft = canvas.getBoundingClientRect().left;
    const canvasTop = canvas.getBoundingClientRect().top;
    pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
    pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;

    if (controls.enabled) {
      const horAngle = controls.getAzimuthalAngle();
      const verAngle = controls.getPolarAngle();
      toggleInfo((-1.4 < horAngle && horAngle < 1.5) || verAngle < 0.6);
    }
  }

  canvas.addEventListener("mousemove", onPointerMove);

  function infoPos(wheelPos: number, cameraPos: number) {
    return wheelPos + (cameraPos - wheelPos) / 1.1;
  }

  function animate() {
    if (wheel1 && info) {
      info.position.set(
        infoPos(wheel1.position.x, camera.position.x),
        infoPos(wheel1.position.y, camera.position.y),
        infoPos(wheel1.position.z, camera.position.z)
      );
      info.lookAt(camera.position);
    }

    raycaster.setFromCamera(pointer, camera);
    if (info) intersectInfo = !!raycaster.intersectObject(info).length;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
};

const InfoBubble: React.FC = () => {
  const [subStep, setSubStep] = useState<SubStep>("loader");
  let highlightArea = { startRow: 35, endRow: 57 }; // Default when loader
  if (subStep === "toggle info") highlightArea = { startRow: 67, endRow: 81 };
  if (subStep === "info click") highlightArea = { startRow: 83, endRow: 121 };
  if (subStep === "back click") highlightArea = { startRow: 123, endRow: 138 };
  if (subStep === "hide info behind car")
    highlightArea = { startRow: 149, endRow: 153 };
  if (subStep === "info button position")
    highlightArea = { startRow: 158, endRow: 170 };
  const subStepIndex = SubStepTypes.findIndex((step) => step === subStep);

  return (
    <>
      <CodeText>
        <h2>Now for the finale</h2>
        <p>
          Well done! You made it to the final step!! Its a big one but we will
          get you through this.
        </p>
        {subStep === "loader" && (
          <>
            <h4>Loading</h4>
            <p>
              The GLTF file we are loading is made up of 2 scenes. The first one
              is the car the second one is the Info button. On load we get the
              front left wheel named Wheel1 and assign it to wheel1 and assign
              the info scene to info. We will use these later to make the info
              button appear like its infront of the wheel.
            </p>
          </>
        )}
        {subStep === "toggle info" && (
          <>
            <h4>Toggle info</h4>
            <p>
              First up we check that we dont hide the info button if its already
              hidden or try to show it if its already shown. If we want to show
              the info button we add it back to the scene and then animate its
              opacity to slowly show. Another great thing about gsap is its
              eventCallback feature. We can use this to hide remove the info
              button from the scene after hiding it.
            </p>
          </>
        )}
        {subStep === "info click" && (
          <>
            <h4>Info click</h4>
            <p>
              First up we check if we have wheel1 and info loaded correctly, we
              also check if we are intersecting with info and if we infoIsShown
              is false to not be able to click on info when its animation to
              being hidden is playing.
            </p>
            <p>
              After that we clone the camera position and quaternion so we can
              animate back to that when we go out of our detail view
            </p>
            <p>
              Next up we animate the position and quaternion of the camera and
              hide the info button.
            </p>
            <p>
              Then we get the back button and show it and add a eventlistener to
              it to for the backClick{" "}
            </p>
          </>
        )}
        {subStep === "back click" && (
          <>
            <h4>Back click</h4>
            <p>
              The back click button is pretty simple. We just animate the camera
              back to its original position and quaternion, remove the
              backbutton, add the info button back and give back controls when
              its done. And then remove the event listener.
            </p>
          </>
        )}
        {subStep === "hide info behind car" && (
          <>
            <h4>Hide info behind car</h4>
            <p>
              This bit of code takes the horizontal and vertical angle of the
              camera converted to a number between -3 and 3 and hides or shows
              the info button if it doesn't fit in the given angles. This makes
              it so you can only see the info button when you can see the acutal
              wheel.
            </p>
          </>
        )}
        {subStep === "info button position" && (
          <>
            <h4>Info button position</h4>
            <p>
              Even though it looks like it the info button isn't actually at the
              same location as the wheel is. It is actually between the position
              of the camera and the wheel. But extremely close to the camera.
              This prevents the info button from clipping into the car.
            </p>
            <p>
              We then also use info.lookAt() to make the info button always face
              the camera
            </p>
          </>
        )}

        <div className="grid grid-cols-3 mt-5 relative">
          {SubStepTypes.map((type) => (
            <button
              key={type}
              className="relative z-10 flex items-center justify-center w-full text-center p-2"
              onClick={() => setSubStep(type)}
            >
              {type}
            </button>
          ))}
          <div
            className="absolute z-0 h-1/2 w-1/3 top-0 left-0 bg-tertary transition-all"
            style={{
              top: subStepIndex > 2 ? "50%" : "0",
              left: subStepIndex * 33 - (subStepIndex > 2 ? 100 : 0) + "%",
            }}
          ></div>
        </div>
      </CodeText>
      <CodeBlockNoInput highlightArea={highlightArea}>{code}</CodeBlockNoInput>
    </>
  );
};

export default InfoBubble;
