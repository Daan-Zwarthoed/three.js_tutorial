import React, { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CodeBlock from "../global/CodeBlock";
import userFunction from "../../helpers/userFunction";
import CodeBlockInline from "../global/CodeBlockInline";
import Image from "next/image";
import AppContext from "../../contexts/AppContextProvider";
const LightModeTypes = [
  "ambient",
  "spot",
  "Spot helper",
  "point",
  "Point helper",
  "directional",
  "Directional helper",
  "hemisphere",
  "Hemisphere helper",
] as const;
type Lightmode = typeof LightModeTypes[number];

const showBefore = `const canvas = document.getElementById("canvas");
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

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshPhysicalMaterial({
  color: "#d63e4d",
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

new OrbitControls(camera, renderer.domElement);
`;

const showAfter = `

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;
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
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x01e3d59, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  window.addEventListener("resize", function () {
    renderer.setSize(
      canvas.parentElement!.clientWidth,
      canvas.parentElement!.clientHeight,
      true
    );
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshPhysicalMaterial({
    color: "#d63e4d",
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true; //default is false
  cube.receiveShadow = true;
  scene.add(cube);

  const geometry2 = new THREE.BoxGeometry(100, 1, 100);
  const material2 = new THREE.MeshPhongMaterial({
    color: "#d63e4d",
  });
  const cube2 = new THREE.Mesh(geometry2, material2);
  cube2.position.y = -8;
  cube2.receiveShadow = true;
  scene.add(cube2);

  userFunction(userScript, ["THREE", "scene"], [THREE, scene]);

  new OrbitControls(camera, renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
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
scene.add( pointLight );
`;
const pointHelperScript = `
const sphereSize = 20;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );
`;

const Light: React.FC = () => {
  const { userScript, setUserScript } = useContext(AppContext);
  const [lightMode, setLightMode] = useState<Lightmode[]>(["ambient", "spot"]);
  useEffect(() => {
    let lightScript = "";
    if (lightMode.includes("ambient")) lightScript += ambientScript;
    if (lightMode.includes("hemisphere")) lightScript += hemisphereScript;
    if (lightMode.includes("Hemisphere helper"))
      lightScript += hemisphereHelperScript;
    if (lightMode.includes("directional"))
      lightScript += "\n" + directionalScript;
    if (lightMode.includes("Directional helper"))
      lightScript += "\n" + directionalHelperScript;
    if (lightMode.includes("spot")) lightScript += "\n" + spotScript;
    if (lightMode.includes("Spot helper"))
      lightScript += "\n" + spotHelperScript;
    if (lightMode.includes("point")) lightScript += "\n" + pointScript;
    if (lightMode.includes("Point helper"))
      lightScript += "\n" + pointHelperScript;

    setUserScript(lightScript);
  }, [lightMode]);

  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-full p-5">
        <p>
          Three js offers multiple types of lights. Adding an ambient light and
          a directionail light will be enough for most projects.
        </p>
        <CodeBlockInline>
          {`const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);`}
        </CodeBlockInline>
        <p>
          Ambient lights are the simpelest of the 2. This will add an even light
          to everything in the scene.
        </p>
        <CodeBlockInline>
          {`const dirLight = new THREE.DirectionalLight(0xffff99, 1);
dirLight.position.set(30, 17, 26);
scene.add(dirLight);`}
        </CodeBlockInline>
        <p>
          To actually create shadows in your scene you will need a directional
          light. A directional light works just like the sun in the way that it
          comes from the position that you choose but doesnt flair outwards in a
          cone.
        </p>
        <div className="relative my-2 w-full h-[300px]">
          <Image src="/images/sixLights.jpg" fill alt="back button"></Image>
        </div>
        <div className="w-full flex flex-row flex-wrap">
          {LightModeTypes.map((type) => (
            <div
              className={`w-1/4 text-center py-4 m-4 border-solid border-2  ${
                lightMode.includes(type) ? "border-accent" : "border-primary"
              }`}
              onClick={() =>
                lightMode.includes(type)
                  ? setLightMode(lightMode.filter((value) => value !== type))
                  : setLightMode([...lightMode, type])
              }
            >
              {type}
            </div>
          ))}
        </div>
      </div>
      <CodeBlock
        showBefore={showBefore}
        showAfter={showAfter}
        inputValue={userScript}
      ></CodeBlock>
    </div>
  );
};

export default Light;
