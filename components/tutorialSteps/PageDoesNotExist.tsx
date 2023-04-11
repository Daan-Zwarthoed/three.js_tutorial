import React from "react";
import Router from "next/router";

const PageDoesNotExist: React.FC = () => {
  return (
    <>
      <h2>Tutorial step does not exist</h2>
      <div
        onClick={() => {
          Router.query.step = "box";
          Router.push(Router);
        }}
      >
        Go to box
      </div>
    </>
  );
};

export default PageDoesNotExist;
