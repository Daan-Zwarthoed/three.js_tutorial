import React from "react";
import NextStepButton from "../global/StepButton";
import StepTitle from "../tutorialHelpers/StepTitle";

const Prerequisites: React.FC = () => {
  return (
    <div className="flex flex-col w-full p-5 max-w-[900px]">
      <StepTitle>
        What do you need (to know) before starting this three.js adventure?
      </StepTitle>
      <h3 className="mt-p">What is Three.js?</h3>
      <p>Okay first things first. What actually is Three.js?</p>
      <p>
        To understand what Three.js is, we first need to understand what WebGL
        is, as Three.js almost always utilizes WebGL for 3D rendering. WebGL is
        a low-level system that can only draw points, lines, and triangles. To
        achieve anything meaningful with WebGL, a considerable amount of code is
        typically required. This is where Three.js comes in. It handles tasks
        such as scenes, lights, shadows, materials, textures, and 3D math. These
        are aspects that you would have to implement manually if you were to use
        WebGL directly.
      </p>
      <h3 className="mt-p">What will you learn in this tutorial?</h3>
      <p>
        This tutorial aims to provide you with a basic understanding of Three.js
        and its capabilities, giving you the necessary building blocks to create
        your own 3D scenes. We will demonstrate how to set up scenes, lights,
        and objects, as well as enable user interaction.
      </p>
      <h3 className="mt-p">What will you need to complete this tutorial?</h3>
      <p>
        To successfully complete this tutorial, you only need a basic
        understanding of JavaScript. If you need to get started with JavaScript,
        you can refer to websites like{" "}
        <a
          className="text-accent underline"
          target="_blank"
          href="https://www.w3schools.com/js/DEFAULT.asp"
        >
          w3schools
        </a>{" "}
        or{" "}
        <a
          className="text-accent underline"
          target="_blank"
          href="https://javascript.info/"
        >
          javascript.info.
        </a>
      </p>
      <p className="mt-3">
        To add Three.js to your own project, we will assume that you already
        have an established project structure with an HTML file linked to a
        JavaScript file. Additionally, you should have installed Three.js and be
        either using a build tool or running a local server with a CDN and
        import maps. If you haven't done this yet, please consult the official
        Three.js{" "}
        <a
          className="text-accent underline"
          target="_blank"
          href="https://threejs.org/docs/#manual/en/introduction/Installation"
        >
          installation guide.
        </a>
      </p>
      <NextStepButton></NextStepButton>
    </div>
  );
};

export default Prerequisites;
