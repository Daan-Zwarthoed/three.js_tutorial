import Head from "next/head";
import React, { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Link from "next/link";

const Home = () => {
  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const loader = new GLTFLoader();
    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      2000000
    );
    camera.position.z = 8;
    camera.position.y = 3;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0xfffff, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffff99, 1);
    directionalLight.position.set(30, 17, 26);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;

    window.addEventListener("resize", function () {
      renderer.setSize(
        canvas.parentElement!.clientWidth,
        canvas.parentElement!.clientHeight,
        true
      );
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    });

    loader.load(
      // resource URL
      // "https://raw.githubusercontent.com/Websitebystudents/pim-pom/main/model/pim_pom_clubhuis_8.gltf"
      // "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedCube/glTF/AnimatedCube.gltf",
      // "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF/BrainStem.gltf",
      // "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/Sponza.gltf",
      "scenes/car.glb",
      // called when the resource is loaded
      async function (gltf) {
        console.log("loaded");
        scene.add(gltf.scene);
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

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
    }
    animate();
  });
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center items-center h-screen">
        <div className="flex flex-row h-fit">
          <article className="max-w-[500px]">
            <h1 className="text-6xl mb-2">The best way too learn three.js</h1>
            <h2>Interactive tutorial to learn three.js</h2>
            <Link
              href="/tutorial?step=prerequisites"
              className="block w-fit bg-accent p-3 rounded-xl mt-2"
            >
              Start tutorial
            </Link>
          </article>
          <canvas id="canvas" className="max-w-[800px]"></canvas>
        </div>
      </main>
    </>
  );
};

export default Home;
