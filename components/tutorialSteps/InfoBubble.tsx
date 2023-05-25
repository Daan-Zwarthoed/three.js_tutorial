import React, { createRef, useContext, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CodeBlock from "../code/CodeBlock";
import gsap, { Power1 } from "gsap";
import CodeText from "../tutorialHelpers/CodeText";
import userFunction from "../../helpers/userFunction";
import AppContext from "../../contexts/AppContextProvider";
import StepTitle from "../tutorialHelpers/StepTitle";

const SubStepTypes = [
  "Loader",
  "Toggle info",
  "Info click",
  "Back click",
  "Hide info behind car",
  "Info button position",
] as const;
type SubStep = (typeof SubStepTypes)[number];

const showImports = `import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import gsap from "gsap";`;

const code = `
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
camera.position.set(-10, 5, 20);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);

// Add lights
const directionalLight = new THREE.DirectionalLight(0xffff99, 2);
directionalLight.position.set(5, 5, 10);
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
  "scenes/Car.glb",
  // called when the resource is loaded
  function (gltf) {
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

// Toggle info button shown or hidden
let infoIsShown = true;
function toggleInfo(show) {
  if (!info || (show && infoIsShown) || (!show && !infoIsShown)) return;
  infoIsShown = show;
  if (show) scene.add(info);
  info.children.forEach((child) => {
    child.material.transparent = true;
    animateTo(child.material, { opacity: show ? 1 : 0 }).eventCallback(
      "onComplete",
      () => {
        if (info && !infoIsShown && !show) scene.remove(info);
      }
    );
  });
}

// Zoom into info button
let oldCameraPosAndQua = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function handleClick() {
  if (!wheel1 || !info || !infoIsShown) return;

  const canvasLeft = canvas.getBoundingClientRect().left;
  const canvasTop = canvas.getBoundingClientRect().top;
  pointer.x = ((event.clientX - canvasLeft) / canvas.clientWidth) * 2 - 1;
  pointer.y = -((event.clientY - canvasTop) / canvas.clientHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersectInfo = !!raycaster.intersectObject(info).length;

  if (!intersectInfo) return;

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
  animateTo(backButton.parentElement.style, {
    display: "flex",
    opacity: 1,
  });

  backButton.addEventListener("click", backClick);
}

canvas.addEventListener("click", handleClick);

// Zoom back out of info button
function backClick() {
  if (!oldCameraPosAndQua || !info) return;
  const backButton = document.getElementById("backButton");

  toggleInfo(true);
  animateTo(camera.position, oldCameraPosAndQua.position);
  animateTo(camera.quaternion, oldCameraPosAndQua.quaternion);
  animateTo(backButton.parentElement.style, {
    display: "none",
    opacity: 0,
  }).eventCallback("onComplete", () => {
    controls.enabled = true;
  });

  backButton.removeEventListener("click", backClick);
}

function controlsUpdate() {
  const horAngle = controls.getAzimuthalAngle();
  const verAngle = controls.getPolarAngle();
  toggleInfo((-1.4 < horAngle && horAngle < 1.5) || verAngle < 0.6);
}

controls.addEventListener("change", controlsUpdate);

// Info positioning calculation
function calculateInfoPos(wheelPos, cameraPos) {
  return wheelPos + (cameraPos - wheelPos) / 1.1;
}

// Set the info position
function setInfoPosition() {
  if (wheel1 && info) {
    info.position.set(
      calculateInfoPos(wheel1.position.x, camera.position.x),
      calculateInfoPos(wheel1.position.y, camera.position.y),
      calculateInfoPos(wheel1.position.z, camera.position.z)
    );
    info.lookAt(camera.position);
  }
}

// Animation loop
function animate() {
  setInfoPosition();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
`;

export const infoBubbleSceneFunction = (userScript: string) => {
  userFunction(
    userScript,
    ["THREE", "GLTFLoader", "OrbitControls", "gsap"],
    [THREE, GLTFLoader, OrbitControls, gsap]
  );
};

const InfoBubble: React.FC = () => {
  const { accessibleSteps, setAccessibleSteps } = useContext(AppContext);
  const [subStep, setSubStep] = useState<SubStep>("Loader");
  const bgActiveButton = createRef<HTMLDivElement>();

  let highlightArea = { startRow: 34, endRow: 57 }; // Default when loader
  if (subStep === "Toggle info") highlightArea = { startRow: 68, endRow: 83 };
  if (subStep === "Info click") highlightArea = { startRow: 85, endRow: 129 };
  if (subStep === "Back click") highlightArea = { startRow: 131, endRow: 147 };
  if (subStep === "Hide info behind car")
    highlightArea = { startRow: 149, endRow: 155 };
  if (subStep === "Info button position")
    highlightArea = { startRow: 157, endRow: 172 };

  // Background of buttons position
  const setOrAnimateBgPosition = (set: boolean) => {
    const activeButton = document.getElementById(subStep + "Button");
    if (!bgActiveButton.current || !activeButton) return;

    gsap[set ? "set" : "to"](bgActiveButton.current.style, {
      height: activeButton.clientHeight + "px",
      width: activeButton.offsetWidth + "px",
      left: activeButton.offsetLeft + "px",
      top: activeButton.offsetTop + "px",

      duration: 1,
      ease: Power1.easeIn,
    });
  };

  const setBgPosition = () => {
    setOrAnimateBgPosition(true);
  };

  useEffect(() => {
    window.removeEventListener("resize", setBgPosition);
    window.addEventListener("resize", setBgPosition);

    setTimeout(() => {
      setOrAnimateBgPosition(false);
    });
  }, [subStep]);

  useEffect(() => {
    if (!accessibleSteps.includes("Finish"))
      setAccessibleSteps([...accessibleSteps, "Finish"]);
  }, []);

  return (
    <>
      <CodeText>
        <StepTitle>Now for the finale</StepTitle>
        <p className="my-8">
          Well done! You made it to the final step!! Its a big one but we will
          get you through this.
        </p>
        {subStep === "Loader" && (
          <>
            <h3>Loading</h3>
            <p>
              The GLTF file we are loading is made up of 2 scenes. The first one
              is the car the second one is the Info button. On load we get the
              front left wheel named Wheel1 and assign it to wheel1 and assign
              the info scene to info. We will use these later to make the info
              button appear like its infront of the wheel.
            </p>
          </>
        )}
        {subStep === "Toggle info" && (
          <>
            <h3>Toggle info</h3>
            <p>
              First up we check that we dont hide the info button if its already
              hidden or try to show it if its already shown. If we want to show
              the info button we add it back to the scene and then animate its
              opacity to slowly show. Another great thing about gsap is its
              eventCallback feature. We can use this to remove the info button
              from the scene after hiding it.
            </p>
          </>
        )}
        {subStep === "Info click" && (
          <>
            <h3>Info click</h3>
            <p>
              First up we check if we have wheel1 and info loaded correctly, we
              also check if we are intersecting with info and if infoIsShown is
              false to not be able to click on info when its animation to being
              hidden is playing.
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
              Then we get the back button, show it and add an eventlistener to
              it to for the backClick{" "}
            </p>
          </>
        )}
        {subStep === "Back click" && (
          <>
            <h3>Back click</h3>
            <p>
              The back click button is pretty simple. We just animate the camera
              back to its original position and quaternion, remove the
              backbutton, add the info button back and give back controls when
              its done. After that we remove the event listener.
            </p>
          </>
        )}
        {subStep === "Hide info behind car" && (
          <>
            <h3>Hide info behind car</h3>
            <p>
              This bit of code takes the horizontal and vertical angle of the
              camera converted to a number between -3 and 3 and hides or shows
              the info button if it doesn't fit in the given angles. This makes
              it so you can only see the info button when you can see the acutal
              wheel.
            </p>
          </>
        )}
        {subStep === "Info button position" && (
          <>
            <h3>Info button position</h3>
            <p>
              Even though it looks like it the info button isn't actually at the
              same location as the wheel is. It is actually inbetween the the
              camera and the wheel. But extremely close to the camera. This
              prevents the info button from clipping into the car.
            </p>
            <p>
              We then also use info.lookAt() to make the info button always face
              the camera
            </p>
          </>
        )}

        <div className="grid grid-cols-3 mt-5 relative border-t-2 border-l-2 border-solid border-white">
          {SubStepTypes.map((type) => (
            <button
              id={type + "Button"}
              key={type}
              className={`relative z-10 flex items-center justify-center w-full text-center p-2 border-r-2 border-b-2 border-solid border-white`}
              onClick={() => setSubStep(type)}
            >
              {type}
            </button>
          ))}
          <div
            ref={bgActiveButton}
            className="absolute z-0 bg-tertary transition-all"
            style={{
              height: "0px",
              width: "0px",
              top: "0px",
              left: "0px",
            }}
          ></div>
        </div>
      </CodeText>
      <CodeBlock
        showImports={showImports}
        code={code}
        highlightArea={highlightArea}
      ></CodeBlock>
    </>
  );
};

export default InfoBubble;
