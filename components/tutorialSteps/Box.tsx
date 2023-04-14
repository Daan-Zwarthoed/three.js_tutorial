import React, { useContext, useEffect } from "react";
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
  renderer.setClearColor(0x01e3d59, 1);

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

const Box: React.FC = () => {
  return (
    <>
      <CodeText>
        <h2>Add your own box to the scene</h2>
        <p>
          To create a cube, we need a BoxGeometry. This is an object that
          contains all the points (vertices) and fill (faces) of the cube. We'll
          explore this more in the future.
        </p>
        <p>
          In addition to the geometry, we need a material to color it. Three.js
          comes with several materials, but we'll stick to the MeshBasicMaterial
          for now. All materials take an object of properties which will be
          applied to them.
        </p>
        <p>
          The third thing we need is a Mesh. A mesh is an object that takes a
          geometry, and applies a material to it, which we then can insert to
          our scene, and move freely around.
        </p>
        <CodeBlockInline>{`const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ 
  color: "#d63e4d"
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);`}</CodeBlockInline>
        <p>Try adding your own cube to the scene!</p>
        <p>Succes!</p>
        <p>
          Take note of the fact we moved the camera back a bit. This is because
          anything added to the scene will by default be added at the
          coordinates 0, 0, 0 so the camera would be inside of the cube.
        </p>
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
