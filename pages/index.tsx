import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Link from "next/link";
import Router from "next/router";
import AppContext from "../contexts/AppContextProvider";
import { stepList } from "./tutorial";
import InfoButton from "../components/global/InfoButton";
let id: number;
const Home = () => {
  const { accessibleSteps, setAccessibleSteps } = useContext(AppContext);
  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const loader = new GLTFLoader();
    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000000
    );
    camera.position.z = 8;
    camera.position.y = 3;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
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
      "scenes/Car.glb",
      // called when the resource is loaded
      function (gltf) {
        console.log("loaded");
        scene.add(gltf.scenes[0]);
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
    cancelAnimationFrame(id);
    function animate() {
      id = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
    }
    animate();
  }, []);

  return (
    <>
      <Head>
        <title>Three.js tutorial</title>
        <meta name="description" content="Three.js tutorial" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center items-center h-screen">
        <div className="flex flex-row h-fit">
          <article className="max-w-[500px]">
            <h1 className="text-6xl mb-2">The best way too learn three.js</h1>
            <h2>Interactive tutorial to learn three.js</h2>
            <div className="flex flex-row flex-wrap mt-p">
              {/* Continue tutorial */}
              {accessibleSteps.length > 0 && (
                <div className="flex flex-row items-center mr-6">
                  <Link
                    href={`/tutorial?step=${
                      accessibleSteps[accessibleSteps.length - 1]
                    }`}
                    className="block bg-primary p-3 rounded-xl my-1 mr-2 w-40 text-center"
                  >
                    Continue tutorial
                  </Link>
                  <InfoButton>
                    Continue the tutorial from where you were
                  </InfoButton>
                </div>
              )}
              {/* Restart or start tutorial */}
              <div className="flex flex-row items-center mr-6">
                <Link
                  href="/tutorial?step=Prerequisites"
                  onClick={() => {
                    setAccessibleSteps(["Prerequisites", "Renderer"]);
                    window.localStorage.setItem(
                      "Resizable_Code_Width",
                      JSON.stringify(90)
                    );
                    window.localStorage.setItem(
                      "Resizable_Canvas_Width",
                      JSON.stringify(90)
                    );
                  }}
                  className={`block p-3 rounded-xl my-1 mr-2 w-40 text-center ${
                    accessibleSteps.length > 0
                      ? "border-2 border-slate-700"
                      : "bg-primary"
                  }`}
                >
                  {accessibleSteps.length > 0 ? "Restart" : "Start"} tutorial
                </Link>
                <InfoButton>
                  {accessibleSteps.length > 0
                    ? "Restart the tutorial from the beginning and remove your progress"
                    : "Start the tutorial. You will need to complete a few assignemnts to be able to continue to the next step."}
                </InfoButton>
              </div>
              {/* Browse tutorial */}
              <div className="flex flex-row items-center mr-6">
                <Link
                  href="/tutorial?step=Prerequisites"
                  onClick={() =>
                    setAccessibleSteps(stepList.map((step) => step.id))
                  }
                  className="block p-3 rounded-xl my-1 mr-2 border-2 border-slate-700 w-40 text-center"
                >
                  Browse tutorial
                </Link>
                <InfoButton>
                  Browse around the tutorial. This will prevent assignments from
                  being manditory to complete.
                </InfoButton>
              </div>
            </div>
          </article>
          <canvas
            id="canvas"
            className="max-w-[700px] max-h-[400px] object-cover"
          ></canvas>
        </div>
      </main>
    </>
  );
};

export default Home;
