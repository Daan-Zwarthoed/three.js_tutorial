import React from "react";
import * as THREE from "three";
import userFunction from "../../helpers/userFunction";
import CodeBlock from "../code/CodeBlock";
import CodeBlockNoInput from "../code/CodeBlockNoInput";
import CodeBlockInline from "../code/CodeBlockInline";
import Image from "next/image";
import Router from "next/router";
import CodeText from "../tutorialHelpers/CodeText";

const showBefore = `import * as THREE from "three";

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
`;

const inputValue = `renderer.setSize();`;

const showAfter = `
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}`;

export const rendererSceneFunction = (userScript: string) => {
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
    renderer.setSize(
      canvas.parentElement!.clientWidth,
      canvas.clientHeight,
      true
    );
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  userFunction(userScript, ["renderer"], [renderer]);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  if (userScript === null) animate();
};

const Renderer: React.FC = () => (
  <CodeText>
    <h4>Basic setup</h4>
    <p>First thing is creating a scene and adding a few things to it.</p>
    <p>
      We starting by adding a canvas to our html with the ID of canvas. After
      this we can work on our javascript:
    </p>
    <CodeBlockInline>
      {`const canvas = document.getElementById("canvas"); 
const scene = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 2000 );

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x01e3d59, 1);`}
    </CodeBlockInline>
    <p>
      Let's take a moment to explain what's going on here. We have now set up
      the scene, our camera and the renderer.
    </p>
    <h4>Camera's</h4>
    <p>
      There are different types of cameras in Three.js for most cases you will
      use the Perspective camera.{" "}
    </p>
    <p>Its first value is the FOV or field of view in degrees.</p>
    <p>
      The second value is the aspect ratio. 99,9% precent of the time you will
      use the size of the canvas otherwise the image will look squished or
      stretched.
    </p>
    <p>
      The other two values are the near and far plane. Anything outside of those
      planes will not be rendered.
    </p>
    <div className="relative my-2 w-[300px] h-[200px]">
      <Image
        src="/images/perspectiveCameraExplenation.png"
        fill
        alt="back button"
      ></Image>
    </div>
    <h4>Renderer</h4>
    <p>
      Next up is the renderer. When setting the renderer size you will also
      almost always want to set it to the width and height of your canvas. We
      also set the background color to blue.
    </p>
    <h4>Animation loop</h4>
    <p>
      Now for actually rendering our scene we use an animation or render loop
    </p>
    <CodeBlockInline>
      {`function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`}
    </CodeBlockInline>
    <p>
      This code causes an animation loop that draws the scene everytime the
      screen is refreshed. (typically 60 times per second)
    </p>
    <p>Okay cool but now im just rendering a blue screen. Lets change that!</p>
    <div
      onClick={() => {
        Router.query.step = "box";
        Router.push(Router);
      }}
    >
      Go to box
    </div>
  </CodeText>
);

export default Renderer;
