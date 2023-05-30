import React, { useContext, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import CodeBlock from "../code/CodeBlock";
import userFunction from "../../helpers/userFunction";
import AppContext from "../../contexts/AppContextProvider";
import CodeText from "../tutorialHelpers/CodeText";
import Note from "../tutorialHelpers/Note";
import Assignment from "../tutorialHelpers/Assignment";
import StepTitle from "../tutorialHelpers/StepTitle";
import Image from "next/image";
import * as FA from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LightModeTypes = [
  "Ambient",
  "Directional",
  "Directional helper",
  "Hemisphere",
  "Hemisphere helper",
  "Spot",
  "Spot helper",
  "Point",
  "Point helper",
  "Rect",
  "Rect helper",
] as const;
type Lightmode = (typeof LightModeTypes)[number];

const showImports = `import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
`;

const codeBefore = `// Basic setup
const canvas = document.getElementById("canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);
renderer.shadowMap.enabled = true;

// Add objects
const material = new THREE.MeshStandardMaterial({
  color: 0xd25e2f,
});

const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const cube = new THREE.Mesh(cubeGeometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

const floorGeometry = new THREE.BoxGeometry(100, 1, 100);
const floor = new THREE.Mesh(floorGeometry, material);
floor.position.y = -8;
floor.receiveShadow = true;
scene.add(floor);

new OrbitControls(camera, renderer.domElement);

// Lights
`;

const ambientScript = `const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
`;

const hemisphereScript = `
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
hemisphereLight.position.set(30, 50, 50);
scene.add(hemisphereLight);
`;
const hemisphereHelperScript = `
const hemisphereHelper = new THREE.HemisphereLightHelper(hemisphereLight, 20);
scene.add(hemisphereHelper);
`;

const directionalScript = `
const directionalLight = new THREE.DirectionalLight(0xffff99, 1);
directionalLight.position.set(30, 50, 50);
directionalLight.castShadow = true;
scene.add(directionalLight);
`;

const directionalHelperScript = `
const directionalHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalHelper);
`;

const spotScript = `
const spotLight = new THREE.SpotLight(0xffff99, 1);
spotLight.position.set(30, 10, 10);
spotLight.castShadow = true;
scene.add(spotLight);
`;

const spotHelperScript = `
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
`;

const rectScript = `
const rectLight = new THREE.RectAreaLight(0xffff99, 50, 10, 10);
rectLight.position.set(30, 10, 10);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);
`;

const rectHelperScript = `
const rectLightHelper = new RectAreaLightHelper(rectLight);
scene.add(rectLightHelper);
`;

const pointScript = `
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(15, 15, 15);
pointLight.castShadow = true;
scene.add(pointLight);
`;
const pointHelperScript = `
const sphereSize = 20;
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
scene.add(pointLightHelper);
`;

const codeAfter = `
// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;

let savedCameraPosition: THREE.Vector3;
let renderer: THREE.WebGLRenderer;

export const lightSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");
  const cameraRendererTextureAndSpotlight = userFunction(
    userScript,
    ["THREE", "RectAreaLightHelper", "OrbitControls", "GLTFLoader"],
    [THREE, RectAreaLightHelper, OrbitControls, GLTFLoader],
    ["camera", "renderer", "texture", "spotLight"]
  );
  if (cameraRendererTextureAndSpotlight) {
    const camera = cameraRendererTextureAndSpotlight[0];
    renderer = cameraRendererTextureAndSpotlight[1];
    const texture = cameraRendererTextureAndSpotlight[2];
    const spotLight = cameraRendererTextureAndSpotlight[3];

    assignmentCheck(texture, spotLight);

    // Save camera position when changing lights
    if (camera) {
      if (savedCameraPosition) {
        camera.position.set(
          savedCameraPosition.x,
          savedCameraPosition.y,
          savedCameraPosition.z
        );
        camera.lookAt(0, 0, 0);
      } else {
        camera.position.set(-75, 40, 75);
        camera.lookAt(0, 0, 0);
      }
      if (canvas)
        canvas.addEventListener("mouseup", () => {
          savedCameraPosition = camera.position;
        });
    }
  }
};

const assignments = {
  addSpotLight: {
    title: "Add a spotlight to the scene.",
    hint: "You can use the buttons above to select the spotlight.",
    checked: false,
  },
  textureLoader: {
    title:
      "Use the TextureLoader to load a doge image from 'images/doge.png' and assign it to a variable called 'texture'.",
    hint: "You can use this code: 'THREE.TextureLoader().load('images/doge.png')'.",
    checked: false,
  },
  spotLightMapIsTexture: {
    title: "Apply that texture to the spotlight's map.",
    hint: "The spotlight has a 'map' property where you can assign your texture.",
    subParagraph: "Nice, well done. You made a doge themed spotlight!",
    checked: false,
  },
};

let interval: number | NodeJS.Timer | undefined;
const assignmentCheck = (
  texture: THREE.Texture,
  spotLight: THREE.SpotLight
) => {
  if (spotLight) assignments.addSpotLight.checked = true;

  if (texture && spotLight) {
    // Keep checking if user completed assignment
    clearInterval(interval as number);
    interval = setInterval(() => {
      // If user loaded texture stop interval
      if (texture.source.data) {
        clearInterval(interval as number);

        const assignmentsClone = JSON.parse(JSON.stringify(assignments));

        assignments.textureLoader.checked = true;
        if (spotLight.map === texture)
          assignments.spotLightMapIsTexture.checked = true;

        if (
          assignmentsClone.textureLoader.checked !==
            assignments.textureLoader.checked ||
          assignmentsClone.spotLightMapIsTexture.checked !==
            assignments.spotLightMapIsTexture.checked
        )
          update();
      }
    }, 1000);
  }
};

const returnLightIcon = (lightMode: Lightmode) => {
  if (lightMode === "Ambient") return <></>;

  if (lightMode === "Spot")
    return (
      <Image
        src="/images/flashlight.png"
        alt={"Flashlight icon"}
        className="rotate-[90deg]"
        width={20}
        height={20}
      ></Image>
    );

  let icon = FA.faQuestion;
  let rotate: number | undefined;
  if (lightMode === "Directional") icon = FA.faSun;
  if (lightMode === "Hemisphere") {
    icon = FA.faAdjust;
    rotate = 90;
  }
  if (lightMode === "Point") icon = FA.faLightbulb;
  if (lightMode === "Rect") icon = FA.faSquareFull;

  return (
    <FontAwesomeIcon
      className="h-5 w-5 relative z-40"
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
      size="sm"
      icon={icon}
      color={"white"}
    />
  );
};

let update: () => void;

const Light: React.FC = () => {
  const { setResetCanvasKey } = useContext(AppContext);
  const [lightMode, setLightMode] = useState<Lightmode[]>(["Ambient", "Point"]);
  const [resetKey, setResetKey] = useState(Math.random());

  update = () => {
    setResetKey(Math.random());
  };

  let lightScript = codeBefore;
  if (lightMode.includes("Ambient")) lightScript += ambientScript;
  if (lightMode.includes("Directional")) lightScript += directionalScript;
  if (lightMode.includes("Directional helper"))
    lightScript += directionalHelperScript;
  if (lightMode.includes("Spot")) lightScript += spotScript;
  if (lightMode.includes("Spot helper")) lightScript += spotHelperScript;
  if (lightMode.includes("Point")) lightScript += pointScript;
  if (lightMode.includes("Point helper")) lightScript += pointHelperScript;
  if (lightMode.includes("Rect")) lightScript += rectScript;
  if (lightMode.includes("Rect helper")) lightScript += rectHelperScript;
  if (lightMode.includes("Hemisphere")) lightScript += hemisphereScript;
  if (lightMode.includes("Hemisphere helper"))
    lightScript += hemisphereHelperScript;

  lightScript += codeAfter;

  const handleLightClick = (type: Lightmode) => {
    setResetCanvasKey(Math.random());
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
    }
    if (lightMode.includes(type)) {
      // Remove light mode. Also remove helper
      setLightMode(
        lightMode.filter(
          (value) => value !== type && value !== type + " helper"
        )
      );
    } else {
      // Add light mode. Add light itself if helper is clicked
      const modes = [...lightMode, type];
      if (type.split(" ")[1] === "helper")
        modes.push(type.split(" ")[0] as Lightmode);
      setLightMode(modes);
    }
  };
  return (
    <>
      <CodeText>
        <StepTitle>Lights</StepTitle>
        <p className="mt-p">
          Three.js offers multiple types of lights. Adding an ambient light and
          a directional light will be sufficient for most projects:
        </p>
        <ol className="my-ol">
          <li className="my-li">
            <strong>Ambient lights</strong> are the simplest of the bunch. They
            provide even lighting to everything in the scene.
          </li>
          <li className="my-li">
            A <strong>directional light</strong> functions similar to the sun,
            emitting light evenly from one direction without spreading out in a
            cone.
          </li>
          <li className="my-li">
            A <strong>hemisphere light</strong> is similar to an ambient light,
            but it transitions from one color to another from top to bottom.
          </li>
          <li className="my-li">
            A <strong>spotlight</strong>, as the name suggests, projects light
            in a cone shape from a chosen point, resembling a spotlight or
            flashlight.
          </li>
          <li className="my-li">
            A <strong>point light</strong> emits light in all directions,
            similar to a light bulb.
          </li>
          <li className="my-li">
            A <strong>rectangle light</strong> functions like a spotlight but
            originates from a rectangular shape instead of a spotlight shape.
          </li>
        </ol>
        <div className="mb-p">
          <Note>
            Note that rectangle lights do not support shadows and are only
            visible on MeshStandardMaterial and MeshPhysicalMaterial.
          </Note>
          <Note>
            Please note that ambient and hemisphere lights do not cast shadows.
          </Note>
        </div>
        <p>
          You can experiment with different lights and their helpers using the
          button below.
        </p>
        <div className="grid grid-cols-2 columns-2 w-full mb-p mt-3 border-secondary border-2">
          {LightModeTypes.map((type) => (
            // Button
            <button
              key={type}
              className="relative w-full text-center py-4 first:col-span-2 border-secondary border-t-2 first:border-0"
              onClick={() => handleLightClick(type)}
            >
              <p className="relative z-10">{type}</p>
              {!type.includes("helper") && (
                <>
                  {/* Icon */}
                  <div className="absolute left-full z-40 h-5 w-5 top-1/2 -translate-y-1/2 -translate-x-1/2">
                    {returnLightIcon(type)}
                  </div>
                  {/* Background */}
                  <div
                    className="absolute transition-all duration-700 bg-tertary left-0 h-full top-0"
                    style={{
                      width: lightMode.includes(type)
                        ? lightMode.includes((type + " helper") as Lightmode)
                          ? "200%"
                          : "100%"
                        : "0",
                    }}
                  ></div>
                </>
              )}
            </button>
          ))}
        </div>
        <Note>Also, note that we added 'shadowMap' to our renderer</Note>
        <Note>
          Additionally, please be aware that we changed the material to
          MeshStandardMaterial. This is because MeshBasicMaterial does not
          interact with lights or shadows. We also manually enabled the object's
          ability to cast and/or receive shadows.
        </Note>
        <Assignment assignments={assignments}></Assignment>{" "}
      </CodeText>

      <CodeBlock
        showImports={showImports}
        code={lightScript}
        scrollToLine={41}
      ></CodeBlock>
    </>
  );
};

export default Light;
