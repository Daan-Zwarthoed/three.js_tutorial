import React, { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CodeBlock from "../code/CodeBlock";
import userFunction from "../../helpers/userFunction";
import CodeBlockInline from "../code/CodeBlockInline";
import Image from "next/image";
import AppContext from "../../contexts/AppContextProvider";
import CodeText from "../tutorialHelpers/CodeText";
const LightModeTypes = [
  "Ambient",
  "Directional",
  "Directional helper",
  "Spot",
  "Spot helper",
  "Point",
  "Point helper",
  "Hemisphere",
  "Hemisphere helper",
] as const;
type Lightmode = typeof LightModeTypes[number];

const showBefore = `import * as THREE from "three";

const canvas = document.getElementById("canvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);

const material = new THREE.MeshPhongMaterial({
  color: "#d63e4d",
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
`;

const showAfter = `

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;

let savedCameraPosition: THREE.Vector3;
let id: number;
export const lightSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    2000000
  );
  if (savedCameraPosition) {
    camera.position.set(
      savedCameraPosition.x,
      savedCameraPosition.y,
      savedCameraPosition.z
    );
  } else {
    camera.position.set(-75, 40, 75);
  }

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x01e3d59, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

  const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshPhongMaterial({
    color: "#d63e4d",
  });
  const cube = new THREE.Mesh(cubeGeometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);

  const floorGeometry = new THREE.BoxGeometry(100, 1, 100);
  const floor = new THREE.Mesh(floorGeometry, material);
  floor.position.y = -8;
  floor.receiveShadow = true;
  scene.add(floor);

  userFunction(userScript, ["THREE", "scene"], [THREE, scene]);

  new OrbitControls(camera, renderer.domElement);

  canvas.addEventListener("mouseup", () => {
    savedCameraPosition = camera.position;
  });

  if (id) cancelAnimationFrame(id);

  function animate() {
    id = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
};

const ambientScript = `const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
`;

const hemisphereScript = `
const hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( hemisphereLight );
`;
const hemisphereHelperScript = `
const hemisphereHelper = new THREE.HemisphereLightHelper( hemisphereLight, 20 );
scene.add( hemisphereHelper );
`;

const directionalScript = `
const directionalLight = new THREE.DirectionalLight(0xffff99, 1);
directionalLight.position.set(30, 50, 50);
directionalLight.castShadow = true;
scene.add(directionalLight);
`;

const directionalHelperScript = `
const directionalHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( directionalHelper );
`;

const spotScript = `
const spotLight = new THREE.SpotLight( 0xffff99, 1 );
spotLight.position.set( 30, 10, 10 );
spotLight.castShadow = true
scene.add(spotLight);
`;

const spotHelperScript = `
const spotLightHelper = new THREE.SpotLightHelper( spotLight );
scene.add( spotLightHelper );
`;

const pointScript = `
const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
pointLight.position.set( 15, 15, 15 );
pointLight.castShadow = true
scene.add( pointLight );
`;
const pointHelperScript = `
const sphereSize = 20;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );
`;

const Light: React.FC = () => {
  const { userScript, setUserScript } = useContext(AppContext);
  const [lightMode, setLightMode] = useState<Lightmode[]>(["Ambient", "Spot"]);
  useEffect(() => {
    let lightScript = "";
    if (lightMode.includes("Ambient")) lightScript += ambientScript;
    if (lightMode.includes("Directional"))
      lightScript += "\n" + directionalScript;
    if (lightMode.includes("Directional helper"))
      lightScript += "\n" + directionalHelperScript;
    if (lightMode.includes("Spot")) lightScript += "\n" + spotScript;
    if (lightMode.includes("Spot helper"))
      lightScript += "\n" + spotHelperScript;
    if (lightMode.includes("Point")) lightScript += "\n" + pointScript;
    if (lightMode.includes("Point helper"))
      lightScript += "\n" + pointHelperScript;
    if (lightMode.includes("Hemisphere")) lightScript += hemisphereScript;
    if (lightMode.includes("Hemisphere helper"))
      lightScript += hemisphereHelperScript;

    setUserScript(lightScript);
  }, [lightMode]);

  return (
    <>
      <CodeText>
        <p>
          Three js offers multiple types of lights. Adding an ambient light and
          a directionail light will be enough for most projects.
        </p>
        <p>
          Ambient lights are the simpelest of the bunch. This will add an even
          light to everything in the scene.
        </p>
        <p>
          To actually create shadows in your scene you will need a directional
          light. A directional light works just like the sun in the way that it
          doesnt flair outwards in a cone.
        </p>
        <p>
          Spotlight like the name suggests works like a spotlight or flaslight
          in the way that it flairs out like a cone from the point you choose
        </p>
        <p>Point light is the same but goes in all directions</p>
        <p>
          A hemisphere light goes from top to bottom from one color to another
        </p>
        <p>
          You can try out the different lights and there helpers witht the
          button below:
        </p>
        <div className="grid grid-cols-2 gap-2 w-full flex flex-row flex-wrap my-5">
          {LightModeTypes.map((type) => (
            <div
              key={type}
              className={`w-full text-center py-4 border-solid border-2 first:col-span-2  ${
                lightMode.includes(type) ? "border-accent" : "border-secondary"
              }`}
              onClick={() => {
                if (lightMode.includes(type)) {
                  setLightMode(
                    lightMode.filter(
                      (value) => value !== type && value !== type + " helper"
                    )
                  );
                } else {
                  const modes = [...lightMode, type];
                  if (type.split(" ")[1] === "helper")
                    modes.push(type.split(" ")[0] as Lightmode);
                  setLightMode(modes);
                }
              }}
            >
              {type}
            </div>
          ))}
        </div>
        <p>
          Also note that we did change the material to MeshPhongMaterial. This
          is because MeshBasicMaterial does not interact with lights or shadows.
        </p>
      </CodeText>

      <CodeBlock
        showBefore={showBefore}
        showAfter={showAfter}
        inputValue={(userScript && userScript.trim()) || " "}
      ></CodeBlock>
    </>
  );
};

export default Light;
