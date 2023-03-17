import React from "react";
import * as THREE from "three";
import gsap from "gsap";
import CodeBlock from "../global/CodeBlock";

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

export const cameraAnimationSceneFunction = (userScript: string) => {
  const canvas = document.getElementById("canvas");
  const raycaster = new THREE.Raycaster();

  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    70,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    2000000
  );
  camera.position.z = 20;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const light2 = new THREE.HemisphereLight(0xffff99, 0xb97a20, 0.5);
  scene.add(light2);

  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material1 = new THREE.MeshBasicMaterial({ color: "#d63e4d" });
  const cube1 = new THREE.Mesh(geometry, material1);
  cube1.position.x = -7;
  cube1.position.y = 7.35;

  const material2 = new THREE.MeshBasicMaterial({ color: "#34eb43" });
  const cube2 = new THREE.Mesh(geometry, material2);
  cube2.position.x = 7;
  cube2.position.y = 7;

  const material3 = new THREE.MeshBasicMaterial({ color: "#ffff99" });
  const cube3 = new THREE.Mesh(geometry, material3);
  cube3.position.x = -7;
  cube3.position.y = -7;

  const material4 = new THREE.MeshBasicMaterial({ color: "#344feb" });
  const cube4 = new THREE.Mesh(geometry, material4);
  cube4.position.x = 7;
  cube4.position.y = -7;

  scene.add(cube1);
  scene.add(cube2);
  scene.add(cube3);
  scene.add(cube4);

  window.addEventListener("resize", function () {
    renderer.setSize(
      canvas.parentElement!.clientWidth,
      canvas.clientHeight,
      true
    );
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  const pointer = new THREE.Vector2();

  function onPointerMove(event: { clientX: number; clientY: number }) {
    if (!canvas) return;
    const restHeight = window.innerHeight - canvas.clientHeight;
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY - restHeight) / canvas.clientHeight) * 2 + 1;
  }
  canvas.addEventListener("mousemove", onPointerMove);

  let intersect: THREE.Object3D<THREE.Event> | null;

  function onClick() {
    if (!intersect) return;
    gsap.to(camera.position, {
      ...new THREE.Vector2(intersect.position.x, intersect.position.y),
      duration: 1,
      ease: "power1.out",
    });
  }
  canvas.addEventListener("click", onClick);

  function animate() {
    if (canvas) renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    intersect = intersects[0] && intersects[0].object;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  if (userScript === null) animate();
};
const CameraAnimation: React.FC = () => {
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

export default CameraAnimation;
