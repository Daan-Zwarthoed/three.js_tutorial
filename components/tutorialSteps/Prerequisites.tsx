import Link from "next/link";
import React from "react";

const Prerequisites: React.FC = () => {
  return (
    <div className="flex flex-col w-full p-5">
      <h2>What do you need before starting this three.js adventure?</h2>
      <p>Okay first things first:</p>
      <ul>
        <li>
          To do this tutorial a basic understanding of Javascript is needed.
          Look at sites like{" "}
          <Link
            className="text-blue-500 underline"
            href="https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics"
          >
            this
          </Link>{" "}
          if you need to get started with javascript first.
        </li>
        <li>
          Also{" "}
          <Link
            className="text-blue-500 underline"
            href="https://nodejs.org/en"
          >
            Node
          </Link>{" "}
          is required and a basic understanding of how npm packages work
        </li>
      </ul>
    </div>
  );
};

export default Prerequisites;
