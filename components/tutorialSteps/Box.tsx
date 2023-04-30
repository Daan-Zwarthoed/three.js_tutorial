import React, { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import userFunction from "../../helpers/userFunction";
import CodeBlock from "../code/CodeBlock";
import CodeBlockInline from "../code/CodeBlockInline";
import CodeText from "../tutorialHelpers/CodeText";
import AppContext from "../../contexts/AppContextProvider";

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
`;

const showAfter = `
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
}
animate();`;

let test = false;
export const boxSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");

  if (!canvas) return;
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
  renderer.setClearColor(0x01e3d59);

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
  const cube = userFunction(
    userScript,
    ["THREE", "scene"],
    [THREE, scene],
    "cube"
  );
  assignmentCheck(cube);

  function animate() {
    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
};

const assignment = {
  cubeExists: false,
  cubeIsCone: false,
  cubeIsGreen: false,
  cubeIs201010: false,
};

const assignmentCheck = (cube: THREE.Mesh) => {
  if (!cube) return;
  if (cube) assignment.cubeExists = true;
  if (cube.geometry.type === "ConeGeometry") assignment.cubeIsCone = true;
  if ((cube.material as any).color.equals(new THREE.Color(0xd25e2f)))
    assignment.cubeIsGreen = true;
};

const Box: React.FC = () => {
  const { userScript } = useContext(AppContext);
  const [checked, setChecked] = useState(assignment);
  useEffect(() => {
    setTimeout(() => setChecked({ ...assignment }));
  }, [userScript]);
  return (
    <>
      <CodeText>
        <h2>Add your own box to the scene</h2>
        <p>To create a cube, we need three things:</p>
        <ol>
          <li>
            First we need a BoxGeometry. This is an object that contains all the
            points and sides of the cube.
          </li>
          <li>
            We also need a material to color the cube. Three.js comes with
            several materials, but we'll stick to the MeshBasicMaterial for now.
            All materials take an object of properties which will be applied to
            them.
          </li>
          <li>
            The third thing we need is a Mesh. A mesh is an object that takes a
            geometry, and applies a material to it, which we then can insert to
            our scene, and move around freely.
          </li>
        </ol>
        <p></p>
        <CodeBlockInline>{`const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ 
  color: 0xd63e4d
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);`}</CodeBlockInline>
        <p>Try adding your own cube to the scene!</p>
        <p>
          Take note of the fact we moved the camera back a bit. This is because
          anything added to the scene will by default be added at the
          coordinates 0, 0, 0 so the camera would be inside of the cube.
        </p>
        <p>
          Also note that in our animation loop we are rotating the cube on every
          frame.
        </p>
        <div>
          <input
            type="checkbox"
            id="scales"
            name="scales"
            className="mr-3"
            checked={checked.cubeExists}
          />
          <label htmlFor="scales">Add your own cube to the scene!</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="scales"
            name="scales"
            className="mr-3"
            checked={checked.cubeIsCone}
          />
          <label htmlFor="scales">Make the cube a ConeGeometry</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="scales"
            name="scales"
            className="mr-3"
            checked={checked.cubeIsGreen}
          />
          <label htmlFor="scales">Make the color: 0xd25e2f</label>
        </div>
      </CodeText>
      <CodeBlock
        showBefore={showBefore}
        showAfter={showAfter}
        inputHeight={6}
      ></CodeBlock>
    </>
  );
};

export default Box;
