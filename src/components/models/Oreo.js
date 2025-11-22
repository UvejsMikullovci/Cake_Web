import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export default function Oreo(props) {
  const group = useRef();
  const { scene } = useGLTF("/models/oreo.glb");

  const clonedScene = clone(scene);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/models/oreo.glb");