import Head from "next/head";
import React, { useContext, useEffect } from "react";
import * as THREE from "three";
type InputProps = {
  renderer?: any;
  cameraType?: THREE.PerspectiveCamera;
  animation?: any;
};

const PageDoesNotExist: React.FC<InputProps> = ({ renderer }) => {
  return (
    <>
      <h2>Tutorial step does not exist</h2>
    </>
  );
};

export default PageDoesNotExist;
