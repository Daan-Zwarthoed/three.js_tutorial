import Link from "next/link";
import React from "react";

const Prerequisites: React.FC = () => {
  return (
    <div className="flex flex-col w-full p-5 max-w-[900px]">
      <h2>
        What do you need (to know) before starting this three.js adventure?
      </h2>
      <h3>What is Three.js?</h3>
      <p>Okay first things first. What actually is Three.js?</p>
      <p>
        Three.js almost always uses WeBGL to draw 3D. WebGL is a very low-level
        system that only draws points, lines, and triangles. To do anything
        useful with WebGL generally requires quite a bit of code and that is
        where three.js comes in. It handles stuff like scenes, lights, shadows,
        materials, textures, 3d math, all things that you'd have to write
        yourself if you were to use WebGL directly.
      </p>
      <h3>What will you learn in this tutorial?</h3>
      <p>
        This tutorial sets out to give you a basic understanding of what
        Three.js has to offer and give you the building blocks to make your own
        creations. We will do this by showing you how to create your own scene,
        lights and objects and make the user able to interact with them.
      </p>
      <h3>What will you need to complete this tutorial?</h3>
      <p>
        To complete this tutorial you will only need a basic understanding of
        Javascript. If you need to get started with javascript first you can
        look at sites like{" "}
        <a
          className="text-blue-500 underline"
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics"
        >
          this.
        </a>{" "}
      </p>
      <p className="mt-2">
        To add Three.js to your own project. We will assume you already have
        your own project structure with a html file linked to a js file. Have
        installed Three.js and are either running a build tool, or using a local
        server with a CDN and import maps. If not look into the{" "}
        <a
          className="text-blue-500 underline"
          target="_blank"
          href="https://threejs.org/docs/#manual/en/introduction/Installation"
        >
          installation guide.
        </a>
      </p>
    </div>
  );
};

export default Prerequisites;
